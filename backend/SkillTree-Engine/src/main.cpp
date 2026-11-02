#include "CategoricalNode.hpp"
#include "ParallelNodes.hpp"
#include "SkillNode.hpp"
#include <iostream>

#include <string>

using namespace SkillTree;
SkillNode *createNode(std::string name) {
  SkillNode *node = new SkillNode(name);
  return node;
}

int main() {

  SkillNode *root = new SkillNode("What are Electronics");

  SkillNode *electric = new SkillNode("What is electricity", root);

  CategoricalNode *quanitites = new CategoricalNode(electric);

  ParallelNodes *voltage_current = new ParallelNodes(electric);

  SkillNode *voltage = new SkillNode("voltage");
  SkillNode *current = new SkillNode("current");
  voltage_current->addParallelNode(voltage);
  voltage_current->addParallelNode(current);

  SkillNode *power = new SkillNode("Power", voltage_current);

  // Traceback from power
  SkillNode *lastNode = power;

  while (lastNode != nullptr) {
    std::cout << lastNode->getName();
    lastNode = lastNode->getParent();
  }
  return 0;
}
