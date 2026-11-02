#pragma once

#include <set>

namespace SkillTree {

class Node {
  Node *parent;
  std::set<Node *> *children = new std::set<Node *>;

protected:
  /** The base constructor for the Node abstract class.
   * @brief Constructs a new Node from a given parent node and a set of child
   * nodes.
   * @param parent - A pointer to the intended parent Node of this initialized
   * node.
   * @param children - A ponter to a set of Node pointers intended to be the
   * children of the initialized node.
   */
  Node(Node *parent = nullptr, std::set<Node *> *children = nullptr)
      : parent(parent), children(children) {}

public:
  /**
   * @brief Adds a child node pointer to this node's children list. Sets the
   * parent of the passed child node to this node.
   *
   * @param child_node - A pointer to intended child node.
   */
  void addChild(Node *child_node) {
    children->insert(child_node);
    child_node->setParent(this);
  }

  /**
   * @brief Sets the parent node of this Node to parent_node
   * @param parent_node - Pointer to the intended parent node.
   */
  virtual void setParent(Node *parent_node) { parent = parent_node; }

  /** Gets a pointer to the current parent Node of this Node. Takes no
   * parameters
   */
  Node *getParent() { return parent; }
  std::set<Node *> *getChildren() { return children; }

  /** Checks if the current node is a root node (has no parents) */
  bool isRoot() { return parent == nullptr; }
  /** Checks if the current node is a leaf (has no children) */
  bool isLeaf() { return children->size() == 0; }
  /** Check if the current node is floating (No children or parents) */
  bool isFloating() { return isRoot() && isLeaf(); }

  /** The primary destructor of the Node abstract class.
   * @brief Iterevely unallocates all children Nodes when destroyed. Takes no
   * parameters.
   */
  ~Node() {
    for (const auto &child : *children) {
      delete child;
    }

    delete children;
  }
};

} // namespace SkillTree