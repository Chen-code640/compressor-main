// 学生信息管理系统

// 存储学生信息的内存数组
let students = [];

/**
 * 添加学生信息
 * @param {string} name - 学生姓名
 * @param {string} id - 学号
 * @param {number} age - 学生年龄
 * @param {string} major - 学生专业
 * @returns {object} 添加的学生信息或错误信息
 */
function addStudent(name, id, age, major) {
  // 验证输入
  if (!name || !id || !age || !major) {
    return { success: false, message: '请输入完整的学生信息' };
  }

  // 检查学号是否已存在
  const existingStudent = students.find(student => student.id === id);
  if (existingStudent) {
    return { success: false, message: `学号 ${id} 已存在` };
  }

  // 检查年龄是否为有效数字
  const ageNum = parseInt(age);
  if (isNaN(ageNum) || ageNum <= 0) {
    return { success: false, message: '请输入有效的年龄' };
  }

  // 创建新学生对象
  const newStudent = {
    name,
    id,
    age: ageNum,
    major
  };

  // 添加到数组
  students.push(newStudent);
  return { success: true, message: `学生 ${name} 添加成功`, student: newStudent };
}

/**
 * 根据学号查询学生信息
 * @param {string} id - 学号
 * @returns {object} 查询到的学生信息或错误信息
 */
function queryStudent(id) {
  if (!id) {
    return { success: false, message: '请输入学号' };
  }

  const student = students.find(student => student.id === id);
  if (!student) {
    return { success: false, message: `未找到学号为 ${id} 的学生` };
  }

  return { success: true, student };
}

/**
 * 根据学号修改学生信息
 * @param {string} id - 学号
 * @param {number} age - 新的年龄（可选）
 * @param {string} major - 新的专业（可选）
 * @returns {object} 修改后的学生信息或错误信息
 */
function updateStudent(id, age, major) {
  if (!id) {
    return { success: false, message: '请输入学号' };
  }

  const studentIndex = students.findIndex(student => student.id === id);
  if (studentIndex === -1) {
    return { success: false, message: `未找到学号为 ${id} 的学生` };
  }

  // 如果没有提供需要修改的信息
  if (!age && !major) {
    return { success: false, message: '请至少提供一项要修改的信息（年龄或专业）' };
  }

  // 创建更新后的学生对象
  const updatedStudent = { ...students[studentIndex] };

  // 更新年龄（如果提供了有效年龄）
  if (age) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum <= 0) {
      return { success: false, message: '请输入有效的年龄' };
    }
    updatedStudent.age = ageNum;
  }

  // 更新专业（如果提供了专业）
  if (major) {
    updatedStudent.major = major;
  }

  // 更新数组中的学生信息
  students[studentIndex] = updatedStudent;
  return { success: true, message: `学生 ${updatedStudent.name} 信息更新成功`, student: updatedStudent };
}

/**
 * 根据学号删除学生信息
 * @param {string} id - 学号
 * @returns {object} 删除结果信息
 */
function deleteStudent(id) {
  if (!id) {
    return { success: false, message: '请输入学号' };
  }

  const studentIndex = students.findIndex(student => student.id === id);
  if (studentIndex === -1) {
    return { success: false, message: `未找到学号为 ${id} 的学生` };
  }

  // 保存要删除的学生姓名用于返回信息
  const studentName = students[studentIndex].name;
  
  // 从数组中删除学生
  students.splice(studentIndex, 1);
  return { success: true, message: `学生 ${studentName} 删除成功` };
}

/**
 * 显示所有学生信息
 * @returns {Array} 所有学生信息的数组
 */
function showAllStudents() {
  return students;
}

// 命令行交互功能
function startInteractiveMode() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('=== 学生信息管理系统 ===');
  console.log('1. 添加学生');
  console.log('2. 查询学生');
  console.log('3. 修改学生信息');
  console.log('4. 删除学生');
  console.log('5. 显示所有学生');
  console.log('6. 退出');

  function askForAction() {
    readline.question('请选择操作 (1-6): ', (action) => {
      switch (action) {
        case '1':
          askForStudentInfo();
          break;
        case '2':
          askForStudentId('query');
          break;
        case '3':
          askForStudentId('update');
          break;
        case '4':
          askForStudentId('delete');
          break;
        case '5':
          showAllStudentsInfo();
          askForAction();
          break;
        case '6':
          console.log('感谢使用学生信息管理系统，再见！');
          readline.close();
          break;
        default:
          console.log('无效的选择，请重新输入');
          askForAction();
      }
    });
  }

  function askForStudentInfo() {
    readline.question('请输入学生姓名: ', (name) => {
      readline.question('请输入学号: ', (id) => {
        readline.question('请输入年龄: ', (age) => {
          readline.question('请输入专业: ', (major) => {
            const result = addStudent(name, id, age, major);
            console.log(result.message);
            if (result.success && result.student) {
              console.log('学生信息:', result.student);
            }
            askForAction();
          });
        });
      });
    });
  }

  function askForStudentId(actionType) {
    readline.question('请输入学号: ', (id) => {
      if (actionType === 'query') {
        const result = queryStudent(id);
        console.log(result.message);
        if (result.success && result.student) {
          console.log('学生信息:', result.student);
        }
      } else if (actionType === 'update') {
        readline.question('请输入新年龄 (回车跳过): ', (age) => {
          readline.question('请输入新专业 (回车跳过): ', (major) => {
            const result = updateStudent(id, age, major);
            console.log(result.message);
            if (result.success && result.student) {
              console.log('更新后的学生信息:', result.student);
            }
            askForAction();
          });
        });
      } else if (actionType === 'delete') {
        const result = deleteStudent(id);
        console.log(result.message);
      }
      askForAction();
    });
  }

  function showAllStudentsInfo() {
    const allStudents = showAllStudents();
    if (allStudents.length === 0) {
      console.log('暂无学生信息');
    } else {
      console.log('所有学生信息:');
      allStudents.forEach(student => {
        console.log(`姓名: ${student.name}, 学号: ${student.id}, 年龄: ${student.age}, 专业: ${student.major}`);
      });
    }
  }

  // 开始交互式模式
  askForAction();
}

// 如果直接运行此文件，则启动交互式模式
if (require.main === module) {
  startInteractiveMode();
}

// 导出所有函数，方便测试和扩展
module.exports = {
  addStudent,
  queryStudent,
  updateStudent,
  deleteStudent,
  showAllStudents
};