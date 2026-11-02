#pragma once

#include "Node.hpp"

namespace SkillTree {

class CategoricalNode : public Node {
  Node *rootNode;

public:
  CategoricalNode(Node *rootNode, Node *parent = nullptr,
                  std::set<Node *> *children = nullptr)
      : Node(parent), rootNode(rootNode) {
    rootNode->setParent(getParent());
  }

  Node *getRootNode() { return rootNode; }
  ~CategoricalNode() { delete rootNode; }
};

} // namespace SkillTree