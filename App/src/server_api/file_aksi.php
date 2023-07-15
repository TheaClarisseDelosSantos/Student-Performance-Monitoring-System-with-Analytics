<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

include "config.php";

$postjson = json_decode(file_get_contents('php://input'), true);




if (isset($postjson) && $postjson['aksi'] == "check_email") {
    $email = $postjson['email'];

    $stmt = $mysqli->prepare("SELECT COUNT(*) AS count FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();

    echo json_encode(['emailExists' => $count > 0]);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == "add_student") {
    $password = password_hash($postjson['password'], PASSWORD_DEFAULT);
    $sectionId = $postjson['sectionId'];

    $stmt = $mysqli->prepare("INSERT INTO users (firstname, middlename, lastname, address, phone, gender, birthdate, section_id, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssssssss", $postjson['fname'], $postjson['mname'], $postjson['lname'], $postjson['address'], $postjson['phone'], $postjson['gender'], $postjson['birthdate'], $sectionId, $postjson['email'], $password);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $response = array('success' => true);
    } else {
        $response = array('success' => false, 'msg' => 'Error, please try again');
    }

    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == "get_grade_levels") {
    $stmt = $mysqli->prepare("SELECT DISTINCT gradelevel FROM sections");
    $stmt->execute();
    $stmt->bind_result($gradeLevel);

    $gradeLevels = array();
    while ($stmt->fetch()) {
        $gradeLevels[] = $gradeLevel;
    }

    $response = array('gradeLevels' => $gradeLevels);
    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == "get_sections") {
    $gradeLevel = $postjson['gradeLevel'];

    $stmt = $mysqli->prepare("SELECT sectionname, section_id FROM sections WHERE gradelevel = ?");
    $stmt->bind_param("s", $gradeLevel);
    $stmt->execute();
    $stmt->bind_result($sectionName, $sectionId);

    $sections = array();
    $sectionIds = array(); // Add an array to store section IDs

    while ($stmt->fetch()) {
        $sections[] = $sectionName;
        $sectionIds[] = $sectionId; // Store section IDs in the array
    }

    $response = array('sections' => $sections, 'sectionIds' => $sectionIds);
    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == "get_grade_levels_sections"){
    $stmt = $mysqli->prepare("SELECT CONCAT(gradelevel, ' - ', sectionname) AS section FROM sections");
    $stmt->execute();
    $stmt->bind_result($gradeLevels);

    $gradeLevelss = array();
    while ($stmt->fetch()){
        $gradeLevelss[] = $gradeLevels;
    }

    $response = array('gradeLevelss' => $gradeLevelss);
    echo json_encode($response);
    exit();
}

if(isset($postjson) && $postjson['aksi'] == 'get_subjects'){
    $stmt = $mysqli->prepare("SELECT subjectname FROM subjects");
    $stmt->execute();
    $stmt->bind_result($subjectName);

    $subjects = array();
    while ($stmt->fetch()){
        $subjects[] = $subjectName;
    }

    $response = array('subjects' => $subjects);
    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == 'add_teacher') {
    $password = password_hash($postjson['password'], PASSWORD_DEFAULT);
    $sectionId = $postjson['sectionId'];

    $stmt = $mysqli->prepare("INSERT INTO teachers (firstname, middlename, lastname, address, phone, gender, birthdate, section_id, email, password) VALUES (?,?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("ssssssssss",$postjson['fname'],$postjson['mname'],$postjson['lname'],$postjson['address'],$postjson['phone'],$postjson['gender'],$postjson['birthdate'],$sectionId, $postjson['email'],$password);
    $stmt->execute();

    if($stmt->affected_rows > 0){
        $teacherId = $stmt->insert_id;
        $assignments = $postjson['assignments'];

        foreach($assignments as $assignment){
            $gradeLevel = $assignment['gradelevel'];
            $subjects = implode(',', $assignment['subjects']);

            // Get the section ID based on the selected grade level and section name
            $stmt = $mysqli->prepare("SELECT section_id FROM sections WHERE CONCAT(gradelevel, ' - ', sectionname) = ?");
            $stmt->bind_param("s", $assignment['gradelevel']);
            $stmt->execute();
            $stmt->bind_result($sectionId);
            $stmt->fetch();
            $stmt->close();

            // Get the subject IDs based on the selected subjects
            $subjectIds = array();
            foreach($assignment['subjects'] as $subjectName){
                $stmt = $mysqli->prepare("SELECT subject_id FROM subjects WHERE subjectname = ?");
                $stmt->bind_param("s", $subjectName);
                $stmt->execute();
                $stmt->bind_result($subjectId);
                $stmt->fetch();
                $subjectIds[] = $subjectId;
                $stmt->close();
            }

            // Insert the data into the assign_teacher table
            foreach($subjectIds as $subjectId){
                $stmt = $mysqli->prepare("INSERT INTO assign_teacher (teacher_id, section_id, subject_id) VALUES (?,?,?)");
                $stmt->bind_param("iii", $teacherId, $sectionId, $subjectId);
                $stmt->execute();
                $stmt->close();
            }
        }

        $response = array('success'=>true);
    }else{
        $response = array('success'=>false, 'msg' => 'Error, please try again');
    }

    echo json_encode($response);
}
if(isset($postjson) && $postjson['aksi'] == "check_teacher_email"){
    $email = $postjson['email'];

    $stmt = $mysqli->prepare("SELECT COUNT(*) AS count FROM teachers WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($count);
    $stmt->fetch();

    echo json_encode(['emailExists' => $count > 0]);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == "login") {
    $email = $postjson['email'];
    $password = $postjson['password'];
    $role = $postjson['role'];

    $table = ''; // Specify the correct table name based on the role

    switch ($role) {
        case 'student':
            $table = 'users';
            break;
        case 'teacher':
            $table = 'teachers';
            break;
        case 'admin':
            $table = 'admin';
            break;
        default:
            $response = array('success' => false, 'msg' => 'Incorrect role');
            echo json_encode($response);
            exit();
    }
    // Prepare and execute the query
    $stmt = $mysqli->prepare("SELECT * FROM $table WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

if ($result->num_rows > 0) {
    $data = $result->fetch_assoc();

    if (password_verify($password, $data['password'])) {
        $datauser = array(
            'user_id' => $data['user_id'],
            'section_id' => $data['section_id'],
            'firstname' => $data['firstname'],
            'middlename' => $data['middlename'],
            'lastname' => $data['lastname'],
            'address' => $data['address'],
            'phone' => $data['phone'],
            'gender' => $data['gender'],
            'birthdate' => $data['birthdate'],
            'email' => $data['email'],

        );

        $response = array('success' => true, 'result' => $datauser);
    } else {
        $response = array('success' => false, 'msg' => 'Invalid email or password');
    }
} else{
    $response = array('success' => false, 'msg' => 'Email not found');
}

// Set the response headers
header('Content-Type: application/json');
echo json_encode($response);
exit();
}


if (isset($postjson) && $postjson['aksi'] == 'get_subjects') {
    $stmt = $mysqli->prepare("SELECT subject_id, subjectname FROM subjects");
    $stmt->execute();
    $stmt->bind_result($subjectId, $subjectName);

    $subjects = array();
    while ($stmt->fetch()) {
        $subject = array(
            'subject_id' => $subjectId,
            'subject_name' => $subjectName
        );
        $subjects[] = $subject;
    }

    $response = array('subjects' => $subjects);
    echo json_encode($response);
    exit();

}
if (isset($postjson) && $postjson['aksi'] == 'get_student_progress') {
    $studentId = $postjson['student_id'];
    $subjectId = $postjson['subject_id'];
    $sectionId = $postjson['section_id'];
    $month = isset($postjson['month']) ? $postjson['month'] : null;

    $startDate = '';
    $endDate = '';

    if($month && $month !== 'This week'){
        $startDate = date('Y-m-01', strtotime($month));
        $endDate = date('Y-m-t', strtotime($month));
    }else{
        $startDate = date('Y-m-d', strtotime('this week'));
        $endDate = date('Y-m-d', strtotime('this week +6 days'));

    }
    $stmt = $mysqli->prepare("SELECT activity_name, score_value, status_value FROM activities 
      INNER JOIN scores ON activities.activity_id = scores.activity_id
      WHERE scores.user_id = ? AND activities.subject_id = ? AND activities.section_id = ? AND activities.date >= ? AND activities.date <= ?");
    $stmt->bind_param("iiiss", $studentId, $subjectId, $sectionId, $startDate, $endDate);
    $stmt->execute();
    $stmt->bind_result($activityName, $scoreValue, $statusValue);

    $progress = array();
    while ($stmt->fetch()) {
        $activity = array(
            'activity_name' => $activityName,
            'score_value' => $scoreValue,
            'status_value' => $statusValue
        );
        $progress[] = $activity;
    }

    $response = array('progress' => $progress);
    echo json_encode($response);
    exit();
}



if (isset($postjson) && $postjson['aksi'] == 'get_section_id') {
    $userID = $postjson['user_id'];

    $stmt = $mysqli->prepare("SELECT section_id FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $userID);
    $stmt->execute();
    $stmt->bind_result($sectionId);

    if ($stmt->fetch()) {
        $response = array(
            'section_id' => $sectionId
        );
    } else {
        $response = array('section_id' => null);
    }

    $stmt->close();

    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == 'get_grades') {
    $quarter = $postjson['quarter'];

    $stmt = $mysqli->prepare("SELECT subjects.subjectname, grades.grade 
                             FROM grades 
                             INNER JOIN subjects ON grades.subject_id = subjects.subject_id 
                             WHERE grades.quarter = ?");
    $stmt->bind_param("s", $quarter);
    $stmt->execute();
    $stmt->bind_result($subjectName, $grade);

    $grades = array();
    while ($stmt->fetch()) {
        $remark = $grade >= 75 ? 'PASSED' : 'FAILED'; 

        $gradeData = array(
            'subject' => $subjectName,
            'grade' => $grade,
            'remark' => $remark
        );
        $grades[] = $gradeData;
    }

    $response = array('grades' => $grades);
    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == 'fetch_student_data') {
    $query = "SELECT * FROM users WHERE user_id = ?"; 
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("i", $postjson['studentId']);
    $stmt->execute();
    $result = $stmt->get_result();

    
    
    if ($result->num_rows > 0) {
      $studentData = $result->fetch_assoc();
      $response = array('success' => true, 'data' => $studentData);
    } else {
      $response = array('success' => false, 'msg' => 'Student data not found');
    }
    
    echo json_encode($response);
    exit();
  }
  
  if (isset($postjson) && $postjson['aksi'] == 'update_student_data') {
    $query = "UPDATE users SET firstname = ?, middlename = ?, lastname = ?, address = ?, phone = ?, gender = ?, birthdate = ? WHERE user_id = ?"; 
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("sssssssi", $postjson['firstName'], $postjson['middleName'], $postjson['lastName'], $postjson['address'], $postjson['phoneNumber'], $postjson['gender'], $postjson['birthdate'], $postjson['studentId']);
    $stmt->execute();
  
    if ($stmt->affected_rows > 0) {
      $response = array('success' => true, 'msg' => 'Student data updated successfully');
    } else {
      $response = array('success' => false, 'msg' => 'Failed to update student data');
    }
  
    echo json_encode($response);
    exit();
  }

  if ($_SERVER['REQUEST_METHOD'] === 'POST' && $postjson['aksi'] === 'change_password') {
    $currentPassword = $postjson['currentPassword'];
    $newPassword = $postjson['newPassword'];
    $studentId = $postjson['studentId'];

    $stmt = $mysqli->prepare("SELECT password FROM users WHERE user_id = ?");
    $stmt->bind_param("i", $studentId);
    $stmt->execute();
    $stmt->bind_result($hashedPassword);
    $stmt->fetch();
    $stmt->close();

    if (password_verify($currentPassword, $hashedPassword)) {
        $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        $stmt = $mysqli->prepare("UPDATE users SET password = ? WHERE user_id = ?");
        $stmt->bind_param("si", $newHashedPassword, $studentId);
        $stmt->execute();
        $stmt->close();

        $response = array('success' => true);
    } else {
        $response = array('success' => false);
    }

    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == 'get_teacher_subjects') {
    $stmt = $mysqli->prepare("SELECT subject_id, subjectname FROM subjects");
    $stmt->execute();
    $stmt->bind_result($subjectId, $subjectName);

    $subjects = array();
    while ($stmt->fetch()) {
        $subject = array(
            'subject_id' => $subjectId,
            'subject_name' => $subjectName
        );
        $subjects[] = $subject;
    }

    $response = array('subjects' => $subjects);
    echo json_encode($response);
    exit();
}

  
  if (isset($postjson) && $postjson['aksi'] == 'get_assigned_sections') {
    $teacherId = $postjson['teacherId'];
  
    $query = "SELECT sections.gradelevel, sections.sectionname, subjects.subjectname
              FROM sections
              INNER JOIN assign_teacher ON sections.section_id = assign_teacher.section_id
              INNER JOIN subjects ON assign_teacher.subject_id = subjects.subject_id
              WHERE assign_teacher.teacher_id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("i", $teacherId);
    $stmt->execute();
    $stmt->bind_result($gradeLevel, $sectionName, $subjectName);
  
    $sections = array();
    while ($stmt->fetch()) {
      $section = array(
        'gradelevel' => $gradeLevel,
        'sectionname' => $sectionName,
        'subjectName' => $subjectName,
      );
      $sections[] = $section;
    }
  
    $response = array('sections' => $sections);
    echo json_encode($response);
    exit();
  }
  
  
  if (isset($postjson) && $postjson['aksi'] == 'get_subject_ids') {
    $selectedSubjects = $postjson['subjects'];
  
    $query = "SELECT subject_id FROM subjects WHERE subjectname IN ('" . implode("','", $selectedSubjects) . "')";
    $stmt = $mysqli->prepare($query);
    $stmt->execute();
    $stmt->bind_result($subjectId);
  
    $subjectIds = array();
    while ($stmt->fetch()) {
      $subjectIds[] = $subjectId;
    }
  
    $response = array('subjectIds' => $subjectIds);
    echo json_encode($response);
    exit();
  }
  
  if (isset($postjson) && $postjson['aksi'] == 'filter_sections') {
    $teacherId = $postjson['teacherId'];
    $selectedSubjects = $postjson['subjects'];
  
    $query = "SELECT sections.gradelevel, sections.sectionname, subjects.subjectname
              FROM sections
              INNER JOIN assign_teacher ON sections.section_id = assign_teacher.section_id
              INNER JOIN subjects ON assign_teacher.subject_id = subjects.subject_id
              WHERE assign_teacher.teacher_id = ? AND assign_teacher.subject_id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("ii", $teacherId, $selectedSubjects[0]);
    $stmt->execute();
    $stmt->bind_result($gradeLevel, $sectionName, $subjectName);
  
    $sections = array();
    while ($stmt->fetch()) {
      $section = array(
        'gradelevel' => $gradeLevel,
        'sectionname' => $sectionName,
        'subjectName' => $subjectName,
      );
      $sections[] = $section;
    }
  
    $response = array('sections' => $sections);
    echo json_encode($response);
    exit();
  }
  
  
?>