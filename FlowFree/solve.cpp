#include <vector>
#include <unordered_map>
#include <iostream>
#include "minisat/core/Solver.h"
#include "FFProblem.hpp"

#ifdef EMCC
#include <emscripten/bind.h>
using namespace emscripten;
#endif

std::vector<int> solve(int rows, int cols, const std::vector<int> &board)
{
    std::unordered_map<int, int> counts;
    std::unordered_map<int, int> oldToNewColor;
    std::vector<int> newToOldColor(1);
    std::vector<int> newBoard;
    for (const auto &el : board)
    {
        if (el == 0)
        {
            newBoard.push_back(0);
        }
        else
        {
            const int color = std::abs(el);
            if (!oldToNewColor.contains(color))
            {
                oldToNewColor[color] = oldToNewColor.size() + 1;
                newToOldColor.push_back(color);
            }
            if (el < 0)
            {
                if (!counts.contains(color))
                {
                    counts[color] = 1;
                }
                else
                {
                    counts[color]++;
                }
                if (counts[color] > 2)
                {
                    return std::vector<int>();
                }
            }
            int newColor = oldToNewColor[color];
            newBoard.push_back(el < 0 ? newColor * -1 : newColor);
        }
    }

    // std::cout << "Printing Board from solve\n";
    // FFProblem::printBoard(rows, cols, newBoard);
    FFProblem problem(rows, cols, counts.size(), newBoard);
    problem.add_clauses();
    bool res = problem.solve();
    if (res)
    {
        std::vector<int> retBoard;
        for (const auto &el : problem.getBoard())
        {
            const int oldColor = newToOldColor[std::abs(el)];
            retBoard.push_back(el < 0 ? oldColor * -1 : oldColor);
        }
        return retBoard;
    }
    return std::vector<int>();
}

#ifdef EMCC
EMSCRIPTEN_BINDINGS(module)
{
    register_vector<int>("IntVector");
    function("solve", &solve);
}
#endif
