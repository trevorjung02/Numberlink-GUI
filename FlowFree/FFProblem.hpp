#include <vector>
#include "minisat/core/Solver.h"
#include <string>

class FFProblem {
public:
    FFProblem(int r, int c, int num_colors, const std::vector<int>& board);
    void add_clauses();
    bool solve();
    const std::vector<int>& getBoard();
    static void printBoard(int rows, int cols, const std::vector<int>& board);

private:
    int rows;
    int cols;
    int num_colors;
    constexpr static int dirs[4][2]{{-1, 0}, {0, -1}, {0, 1}, {1, 0}};
    std::vector<int> board;
    Minisat::Solver solver;
    std::vector<Minisat::Lit> base_lits;
    Minisat::vec<Minisat::Lit> assumps;

    
    Minisat::Lit get_exact_color_equiv(int square, int color);
    void add_clauses_exact_color_filled(int square, int color);
    void add_clause_exact_n_neighbors(int i, int j, int n, int color, Minisat::vec<Minisat::Lit>& clause);
    void add_clause_exact_n_neighbors_backtrack(int cur, int n, int color, std::vector<Minisat::Lit> lits, const std::vector<int>& neighbors, Minisat::vec<Minisat::Lit>& clause);
    
    Minisat::Lit add_clause_and_equiv(const std::vector<Minisat::Lit>& lits);
    Minisat::Lit add_clause_and_equiv(const Minisat::Lit& a, const Minisat::Lit& b);

    bool valid_square(int i, int j);
    Minisat::Lit getLit(int square, int color, int sign);

    std::string Lit_to_string(Minisat::Lit l);
    void print_clause(Minisat::Lit a);
    void print_clause(Minisat::Lit a, Minisat::Lit b);
    void print_clause(Minisat::Lit a, Minisat::Lit b, Minisat::Lit c);
    void print_clause(const Minisat::vec<Minisat::Lit>& clause);
};
