#include <iostream>
#include <format>
#include <vector>
#include "minisat/core/Solver.h"
#include "FFProblem.hpp"

FFProblem::FFProblem(int rows, int cols, int num_colors, const std::vector<int> &board)
{
    this->rows = rows;
    this->cols = cols;
    this->num_colors = num_colors;
    this->board = board;
}

void FFProblem::add_clauses()
{
    for (int v = 0; v < rows * cols * num_colors; v++)
    {
        solver.newVar(v);
        base_lits.push_back(Minisat::mkLit(v, false));
        base_lits.push_back(Minisat::mkLit(v, true));
    }

    for (int i = 0; i < rows * cols; i++)
    {
        if (board[i] == 0)
        {
            Minisat::vec<Minisat::Lit> lits;
            for (int color = 1; color <= num_colors; color++)
            {
                lits.push(get_exact_color_equiv(i, color));
            }
            // print_clause(lits);
            solver.addClause(lits);
        }
        else
        {
            add_clauses_exact_color_filled(i, std::abs(board[i]));
        }
    }

    for (int i = 0; i < rows; i++)
    {
        for (int j = 0; j < cols; j++)
        {
            Minisat::vec<Minisat::Lit> clause;
            if (board[i * cols + j] >= 0)
            {
                for (int color = 1; color <= num_colors; color++)
                {
                    add_clause_exact_n_neighbors(i, j, color, 2, clause);
                }
            }
            else
            {
                add_clause_exact_n_neighbors(i, j, std::abs(board[i * cols + j]), 1, clause);
            }
            solver.addClause(clause);
        }
    }
}

bool FFProblem::solve()
{
    bool res = solver.solve(assumps);
    if (res)
    {
        for (int i = 0; i < rows * cols; i++)
        {
            if (board[i] >= 0)
            {
                for (int c = 1; c <= num_colors; c++)
                {
                    // std::cout << Minisat::toInt(solver.modelValue(i*num_colors + c-1)) << " ";
                    if (Minisat::toInt(solver.modelValue(i * num_colors + c - 1)) == 0)
                    {
                        board[i] = c;
                    }
                }
            }
        }
    }
    return res;
}

void FFProblem::add_clause_exact_n_neighbors(int i, int j, int color, int n, Minisat::vec<Minisat::Lit> &clause)
{
    // std::cout << std::format("add_clause_exact_n_neighbors({},{},{},{}): \n", i, j, color, n);

    std::vector<int> neighbors;
    for (const auto &dir : dirs)
    {
        if (valid_square(i + dir[0], j + dir[1]))
        {
            neighbors.push_back((i + dir[0]) * cols + j + dir[1]);
        }
    }
    std::vector<Minisat::Lit> lits;
    lits.push_back(getLit(i * cols + j, color, 0));
    add_clause_exact_n_neighbors_backtrack(0, n, color, lits, neighbors, clause);
    // print_clause(clause);
}

void FFProblem::add_clause_exact_n_neighbors_backtrack(int cur, int n, int color, std::vector<Minisat::Lit> lits, const std::vector<int> &neighbors, Minisat::vec<Minisat::Lit> &clause)
{
    if (cur == neighbors.size())
    {
        clause.push(add_clause_and_equiv(lits));
        return;
    }
    if (n > 0)
    {
        lits.push_back(getLit(neighbors[cur], color, 0));
        add_clause_exact_n_neighbors_backtrack(cur + 1, n - 1, color, lits, neighbors, clause);
        lits.pop_back();
    }
    if (neighbors.size() - cur > n)
    {
        lits.push_back(getLit(neighbors[cur], color, 1));
        add_clause_exact_n_neighbors_backtrack(cur + 1, n, color, lits, neighbors, clause);
        lits.pop_back();
    }
}

bool FFProblem::valid_square(int i, int j)
{
    return 0 <= i && i < rows && 0 <= j && j < cols;
}

void FFProblem::add_clauses_exact_color_filled(int square, int color)
{
    for (int i = 1; i <= num_colors; i++)
    {
        Minisat::Lit l = getLit(square, i, (i == color ? 0 : 1));
        solver.addClause(l);
        assumps.push(l);
    }
}

Minisat::Lit FFProblem::get_exact_color_equiv(int square, int color)
{
    // std::cout << std::format("get_exact_color_equiv({}, {}): ", square, color);

    std::vector<Minisat::Lit> lits;
    for (int i = 1; i <= num_colors; i++)
    {
        Minisat::Lit l = getLit(square, i, (i == color ? 0 : 1));
        lits.push_back(l);
        // std::cout << std::format("{}{} {} ", (i == color ? "" : "-"), i, Lit_to_string(l));
        // std::cout << std::format("{} ", Lit_to_string(l));
    }

    return add_clause_and_equiv(lits);
}

Minisat::Lit FFProblem::add_clause_and_equiv(const std::vector<Minisat::Lit> &lits)
{
    // std::cout << std::format("add_clause_and_equiv( ", lits.size());
    // for(const auto& l : lits) {
    //     std::cout << Lit_to_string(l) << " ";
    // }
    // std::cout << ")" << std::endl;

    Minisat::Lit l = add_clause_and_equiv(lits[0], lits[1]);
    for (int i = 2; i < lits.size(); i++)
    {
        l = add_clause_and_equiv(l, lits[i]);
    }
    return l;
}

Minisat::Lit FFProblem::add_clause_and_equiv(const Minisat::Lit &a, const Minisat::Lit &b)
{
    Minisat::Var v = solver.newVar();
    Minisat::Lit l = Minisat::mkLit(v);
    Minisat::Lit l_ = Minisat::mkLit(v, true);

    // print_clause(l, Minisat::mkLit(Minisat::var(a), !Minisat::sign(a)), Minisat::mkLit(Minisat::var(b), !Minisat::sign(b)));
    // print_clause(l_, a);
    // print_clause(l_, b);

    solver.addClause(l, Minisat::mkLit(Minisat::var(a), !Minisat::sign(a)), Minisat::mkLit(Minisat::var(b), !Minisat::sign(b)));
    solver.addClause(l_, a);
    solver.addClause(l_, b);
    return l;
}

Minisat::Lit FFProblem::getLit(int square, int color, int sign)
{
    return base_lits[2 * num_colors * (square) + 2 * (color - 1) + sign];
}

std::string FFProblem::Lit_to_string(Minisat::Lit l)
{
    if (l.x < rows * cols * num_colors * 2)
    {
        int square = l.x / (2 * num_colors);
        int color = (l.x % (2 * num_colors)) / 2 + 1;
        return std::format("{}({},{},{})", (Minisat::sign(l) ? "-" : ""), square / cols, square % cols, color);
    }
    else
    {
        return std::format("{}", l.x);
    }
}

void FFProblem::print_clause(const Minisat::vec<Minisat::Lit> &clause)
{
    for (int i = 0; i < clause.size(); i++)
    {
        std::cout << Lit_to_string(clause[i]) << " ";
    }
    std::cout << std::endl;
}

void FFProblem::print_clause(Minisat::Lit a)
{
    std::cout << std::format("{}\n", Lit_to_string(a));
}

void FFProblem::print_clause(Minisat::Lit a, Minisat::Lit b)
{
    std::cout << std::format("{} {}\n", Lit_to_string(a), Lit_to_string(b));
}

void FFProblem::print_clause(Minisat::Lit a, Minisat::Lit b, Minisat::Lit c)
{
    std::cout << std::format("{} {} {}\n", Lit_to_string(a), Lit_to_string(b), Lit_to_string(c));
}

void FFProblem::printBoard(int rows, int cols, const std::vector<int> &board)
{
    for (int i = 0; i < rows; i++)
    {
        for (int j = 0; j < cols; j++)
        {
            int color = board[i * cols + j];
            char c;
            if (color == 0)
            {
                c = '-';
            }
            else if (color < 0)
            {
                c = -color + 'A' - 1;
            }
            else
            {
                c = color + 'a' - 1;
            }
            std::cout << std::format("{} ", c);
            // std::cout << std::format("{} ", color);
        }
        std::cout << '\n';
    }
    std::cout << std::endl;
}

const std::vector<int> &FFProblem::getBoard()
{
    return board;
}