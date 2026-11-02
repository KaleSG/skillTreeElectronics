cmake_minimum_required(VERSION 3.31)

project(SkillTreeEngine)

add_executable(CMAKE_PROJECT_NAME)

target_sources(CMAKE_PROJECT_NAME
 PRIVATE
 src/main.cpp
)

add_subdirectory(src/skill_tree)