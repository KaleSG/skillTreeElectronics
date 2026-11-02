#pragma once

#include "Node.hpp"

namespace SkillTree {

class CategoricalNode : Node {
  Node *rootNode;

public:
  CategoricalNode(Node *rootNode, Node *parent = nullptr,
                  std::set<Node *> *children = nullptr)
      : Node(parent, children), rootNode(rootNode) {}

  Node *getRootNode() { return rootNode; }
  ~CategoricalNode() { delete rootNode; }
};

} // namespace SkillTree