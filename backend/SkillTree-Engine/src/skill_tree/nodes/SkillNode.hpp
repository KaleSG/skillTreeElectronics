#pragma once
#include "Node.hpp"
#include <string>

namespace SkillTree {

class SkillNode : public Node {
  std::string name;

public:
  SkillNode(std::string name, Node *parent = nullptr)
      : Node(parent), name(name){this->node}

        std::string getName() {
    return name;
  }
};
} // namespace SkillTree