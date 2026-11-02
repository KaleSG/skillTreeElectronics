#pragma once

#include "Node.hpp"
#include <set>
#include <stdexcept>

namespace SkillTree {
class ParallelNodes : public Node {
  std::set<Node *> *parallelNodes = new std::set<Node *>;

  /**
   * @brief Checks if a node is valid for use within a parallel nodes structure.
   *
   * @param node
   * @return true - true if the given node has no other parents or children
   * @return false - If true case is not valid.
   */
  bool isParallelNodeValid(Node *node) { return node->isFloating(); }

  /** Assigns contained nodes with the same parent as current ParallelNodes
   * object. Functionally, this allows us to figure out pre-requities for a
   * given
   */
  void assignParallelNodesParent() {
    for (Node *node : *parallelNodes) {
      node->setParent(this->getParent());
    }
  }

public:
  ParallelNodes(Node *parent = nullptr) : Node(parent) {}

  /**
   * @brief Adds a floating node to a parallel nodes group. Node must be
   * floating, or an error is thrown. Sets added Node parent to the parent of
   * the entire ParallelNodes group.
   * @param node
   */
  void addParallelNode(Node *node) {
    if (isParallelNodeValid(node)) {
      parallelNodes->insert(node);
      node->setParent(this->getParent());
    } else {
      throw std::invalid_argument(
          "Individual Parallel nodes must have no parents or children.");
    }
  }

  /**
   * @brief Gets all contained parallel nodes within this ParallelNodes object.
   * @return std::set<Node *>* returns a set of node pointers to contained
   * nodes.
   */
  std::set<Node *> *getParallelNodes() { return parallelNodes; }

  /**
   * @brief Sets the parent of both the ParallelNodes object and its containing
   * nodes.
   * @param node
   */
  void setParent(Node *node) override {
    this->setParent(node);
    assignParallelNodesParent();
  }

  ~ParallelNodes() {
    for (Node *node : *parallelNodes) {
      delete node;
    }

    delete parallelNodes;
  }
};
} // namespace SkillTree