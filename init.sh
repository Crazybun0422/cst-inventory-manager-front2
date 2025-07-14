#!/bin/bash
# 初始化项目的 Git hooks
cp hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit