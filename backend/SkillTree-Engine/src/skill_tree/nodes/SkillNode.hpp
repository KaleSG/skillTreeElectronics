#pragma once
#include "Node.hpp"
#include <string>

namespace SkillTree {

class SkillNode : public Node {
  std::string name;

public:
  SkillNode(std::string name, Node *parent = nullptr)
      : Node(parent), name(name) {}

  std::string getName() { return name; }
};
} // namespace SkillTree