#pragma once
#include "Node.hpp"

namespace SkillTree {
class SkillNode : Node {
public:
  SkillNode(Node *parent = nullptr, std::set<Node *> *children = nullptr)
      : Node(parent, children) {}
};
} // namespace SkillTree