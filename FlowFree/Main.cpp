#include <iostream>
#include <fstream>
#include <format>
#include <vector>
#include <cstring>
#include "minisat/core/Solver.h"
#include "FFProblem.hpp"
#include "solve.hpp"

int main(int argc, char *argv[])
{
    if (argc < 2 || argc > 3)
    {
        std::cerr << std::format("usage: flowfree [-g] input_file\n", argv[0]);
        return 1;
    }
    bool gridInput = false;
    if (argc == 3)
    {
        if (strcmp(argv[1], "-g") == 0)
        {
            gridInput = true;
        }
        else
        {
            std::cerr << std::format("usage: flowfree [-g] input_file\n", argv[0]);
            return 1;
        }
    }
    std::ifstream f(argv[argc - 1]);
    if (!f.is_open())
    {
        std::cerr << std::format("flowfree: cannot open file {}\n", argv[1]);
        return 1;
    }
    int rows, cols, num_colors;
    f >> rows;
    f >> cols;

    std::vector<int> board(rows * cols);
    if (!gridInput)
    {
        for (int num = 0; f.good(); num++)
        {
            int i, j;
            f >> i;
            f >> j;
            if (!f.good())
            {
                break;
            }
            num_colors = num / 2 + 1;
            board[i * cols + j] = -num_colors;
        }
    }
    else
    {
        for (int i = 0; i < rows * cols; i++)
        {
            f >> board[i];
        }
    }
    std::cout << "Initial Board\n";
    FFProblem::printBoard(rows, cols, board);
    std::vector<int> ret = solve(rows, cols, board);
    if (ret.size() > 0)
    {
        std::cout << "Solved\n";
        FFProblem::printBoard(rows, cols, ret);
    }
    else
    {
        std::cout << "Not Solvable\n";
    }
}
