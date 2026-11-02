cmake_minimum_required(VERSION 3.31)

project(SkillTreeEngine)

add_executable(SkillTreeEngine)

target_sources(SkillTreeEngine
 PRIVATE
 src/main.cpp
)

add_subdirectory(src/skill_tree)