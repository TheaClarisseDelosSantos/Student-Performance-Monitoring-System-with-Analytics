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
    $sectionIds = array(); 

    while ($stmt->fetch()) {
        $sections[] = $sectionName;
        $sectionIds[] = $sectionId; 
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

            
            $stmt = $mysqli->prepare("SELECT section_id FROM sections WHERE CONCAT(gradelevel, ' - ', sectionname) = ?");
            $stmt->bind_param("s", $assignment['gradelevel']);
            $stmt->execute();
            $stmt->bind_result($sectionId);
            $stmt->fetch();
            $stmt->close();

            
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

    $table = ''; 
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

if (isset($postjson) && $postjson['aksi'] == 'get_student_grades') {
    $quarter = $postjson['quarter'];
    $studentId = $postjson['studentId'];

    $stmt = $mysqli->prepare("SELECT subjects.subjectname, grades.grade 
                             FROM grades 
                             INNER JOIN subjects ON grades.subject_id = subjects.subject_id 
                             WHERE grades.quarter = ? AND grades.student_id = ?");
    $stmt->bind_param("ss", $quarter, $studentId);
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
  
    $query = "SELECT sections.gradelevel, sections.sectionname, sections.section_id, subjects.subjectname, subjects.subject_id
              FROM sections
              INNER JOIN assign_teacher ON sections.section_id = assign_teacher.section_id
              INNER JOIN subjects ON assign_teacher.subject_id = subjects.subject_id
              WHERE assign_teacher.teacher_id = ?";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("i", $teacherId);
    $stmt->execute();
    $stmt->bind_result($gradeLevel, $sectionName, $sectionId,$subjectName,$subjectId);
  
    $sections = array();
    while ($stmt->fetch()) {
      $section = array(
        'gradelevel' => $gradeLevel,
        'sectionname' => $sectionName,
        'section_id' => $sectionId,
        'subjectName' => $subjectName,
        'subject_id' => $subjectId
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

    $query = "SELECT sections.gradelevel, sections.sectionname, sections.section_id, subjects.subjectname, subjects.subject_id
              FROM sections
              INNER JOIN assign_teacher ON sections.section_id = assign_teacher.section_id
              INNER JOIN subjects ON assign_teacher.subject_id = subjects.subject_id
              WHERE assign_teacher.teacher_id = ? AND assign_teacher.subject_id IN (".implode(',', $selectedSubjects).")";
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("i", $teacherId);
    $stmt->execute();
    $stmt->bind_result($gradeLevel, $sectionName, $sectionId, $subjectName, $subjectId);

    $sections = array();
    while ($stmt->fetch()) {
        $section = array(
            'gradelevel' => $gradeLevel,
            'sectionname' => $sectionName,
            'section_id' => $sectionId,
            'subjectName' => $subjectName,
            'subjectId' => $subjectId
        );
        $sections[] = $section;
    }

    $response = array('sections' => $sections);
    echo json_encode($response);
    exit();
}

  
  if (isset($postjson) && $postjson['aksi'] == 'get_students_by_section_subject') {
    if (!isset($postjson['sectionId']) || !isset($postjson['subjectId'])) {
      $response = array('error' => 'Invalid request: sectionId or subjectId is missing');
      echo json_encode($response);
      exit();
    }
  
    $sectionId = $postjson['sectionId'];
    $subjectId = $postjson['subjectId'];
  
    $stmt = $mysqli->prepare("SELECT users.user_id, users.firstname, users.lastname
                              FROM users
                              INNER JOIN assign_teacher ON users.section_id = assign_teacher.section_id
                              WHERE assign_teacher.section_id = ? AND assign_teacher.subject_id = ?");
    $stmt->bind_param("ii", $sectionId, $subjectId);
    $stmt->execute();
    $result = $stmt->get_result();
  
    $students = array();
    while ($row = $result->fetch_assoc()) {
      $student = array(
        'student_id' => $row['user_id'],
        'full_name' => $row['lastname'] . ', ' . $row['firstname'],
      );
      $students[] = $student;
    }
  
    $response = array('students' => $students);
    echo json_encode($response);
    exit();
  }

  if (isset($postjson) && $postjson['aksi'] == 'get_section_details') {
    $sectionId = $postjson['sectionId'];

    $stmt = $mysqli->prepare("SELECT gradelevel, sectionname FROM sections WHERE section_id = ?");
    $stmt->bind_param("i", $sectionId);
    $stmt->execute();
    $stmt->bind_result($gradeLevel, $sectionName);

    if ($stmt->fetch()) {
        $sectionDetails = array(
            'gradelevel' => $gradeLevel,
            'sectionname' => $sectionName
        );
        echo json_encode($sectionDetails);
    } else {
        echo json_encode(array('error' => 'Section not found'));
    }
    $stmt->close();
}

if (isset($postjson) && $postjson['aksi'] == "add_activity") {
    if (isset($postjson['activityName'], $postjson['subjectId'], $postjson['sectionId'], $postjson['studentId'], $postjson['score_value'], $postjson['status_value'], $postjson['date'])) {
        $activityName = $postjson['activityName'];
        $subjectId = $postjson['subjectId'];
        $sectionId = $postjson['sectionId'];
        $studentId = $postjson['studentId'];
        $scoreValue = $postjson['score_value'];
        $statusValue = $postjson['status_value'];
        $date = $postjson['date'];

        $stmt = $mysqli->prepare("INSERT INTO activities (activity_name, subject_id, section_id, date) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("siss", $activityName, $subjectId, $sectionId, $date);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $activityId = $stmt->insert_id;

            $stmt2 = $mysqli->prepare("INSERT INTO scores (activity_id, user_id, score_value, status_value) VALUES (?, ?, ?, ?)");
            $stmt2->bind_param("iiss", $activityId, $studentId, $scoreValue, $statusValue);
            $stmt2->execute();

            if ($stmt2->affected_rows > 0) {
                $response = array('success' => true, 'msg' => 'Activity and scores added successfully');
            } else {
                $response = array('success' => false, 'msg' => 'Failed to add scores');
            }

            $stmt2->close();
        } else {
            $response = array('success' => false, 'msg' => 'Failed to add activity');
        }
    } else {
        $response = array('success' => false, 'msg' => 'Missing required fields');
    }

    echo json_encode($response);
    exit();
}



if (isset($postjson) && $postjson['aksi'] == 'save_tasks') {
    $studentData = $postjson['studentData'];

    foreach ($studentData as $student) {
        $studentId = $student['student_id'];
        $activities = $student['activities'];
        $scores = $student['scores'];

        $stmt = $mysqli->prepare("INSERT INTO activities (activity_name, subject_id, section_id, date) VALUES (?, ?, ?, NOW())");
        $stmt->bind_param("sii", $activityName, $subjectId, $sectionId);

        foreach ($activities as $activity) {
            $activityName = $activity['activity_name'];
            $subjectId = $activity['subject_id'];
            $sectionId = $activity['section_id'];
            $stmt->execute();

            $activityId = $stmt->insert_id;

            $stmt2 = $mysqli->prepare("INSERT INTO scores (activity_id, user_id, score_value, status_value) VALUES (?, ?, ?, ?)");
            $stmt2->bind_param("iiis", $activityId, $studentId, $scoreValue, $statusValue);

            foreach ($scores as $score) {
                $scoreValue = $score['score_value'];
                $statusValue = $score['status_value'];
                $stmt2->execute();
            }

            $stmt2->close();
        }

        $stmt->close();
    }

    $response = array('success' => true);
    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == 'add_score') {
    $activityId = $postjson['activityId'];
    $studentId = $postjson['studentId'];
    $scoreValue = $postjson['scoreValue'];
    $statusValue = $postjson['statusValue'];

    $stmt = $mysqli->prepare("INSERT INTO scores (activity_id, user_id, score_value, status_value) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("iiis", $activityId, $studentId, $scoreValue, $statusValue);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $response = array('success' => true, 'msg' => 'Score added successfully');
    } else {
        $response = array('success' => false, 'msg' => 'Failed to add score');
    }

    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == 'get_activities') {
    $studentId = $postjson['studentId'];
    $subjectId = $postjson['subjectId'];

    $stmt = $mysqli->prepare("SELECT a.activity_id, a.activity_name, s.score_value, s.status_value FROM activities AS a INNER JOIN scores AS s ON a.activity_id = s.activity_id WHERE s.user_id = ? AND a.subject_id = ?");
    $stmt->bind_param("ii", $studentId, $subjectId);
    $stmt->execute();
    $result = $stmt->get_result();

    $activities = array();
    while ($row = $result->fetch_assoc()) {
        $activity = array(
            'id' => $row['activity_id'],
            'activity_name' => $row['activity_name'],
            'score_value' => $row['score_value'],
            'status_value' => $row['status_value'],
            'subject_id' => $subjectId,
        );
        $activities[] = $activity;
    }

    $response = array('activities' => $activities);
    echo json_encode($response);
    exit();
}


if (isset($postjson) && $postjson['aksi'] == 'update_activity') {
    if (isset($postjson['activityId'], $postjson['activityName'], $postjson['score_value'], $postjson['status_value'])) {
        $activityId = $postjson['activityId'];
        $activityName = $postjson['activityName'];
        $scoreValue = $postjson['score_value'];
        $statusValue = $postjson['status_value'];

        $stmt = $mysqli->prepare("UPDATE activities AS a INNER JOIN scores AS s ON a.activity_id = s.activity_id SET a.activity_name = ?, s.score_value = ?, s.status_value = ? WHERE a.activity_id = ?");
        $stmt->bind_param("sssi", $activityName, $scoreValue, $statusValue, $activityId);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            $response = array('success' => true, 'msg' => 'Activity and scores updated successfully');
        } else {
            $response = array('success' => false, 'msg' => 'Failed to update activity and scores');
        }
    } else {
        $response = array('success' => false, 'msg' => 'Invalid request parameters');
    }

    echo json_encode($response);
    exit();
}



if (isset($postjson) && $postjson['aksi'] == 'remove_activity') {
    $activityId = $postjson['activityId'];

    $stmt = $mysqli->prepare("SELECT activity_id FROM activities WHERE activity_id = ?");
    $stmt->bind_param("i", $activityId);
    $stmt->execute();
    $stmt->store_result();
    $activityExists = $stmt->num_rows > 0;
    $stmt->close();

    if (!$activityExists) {
        $response = array('status' => 'error', 'message' => 'Activity does not exist');
        echo json_encode($response);
        exit();
    }

    $stmt = $mysqli->prepare("DELETE FROM scores WHERE activity_id = ?");
    $stmt->bind_param("i", $activityId);
    $stmt->execute();
    $stmt->close();

    $stmt = $mysqli->prepare("DELETE FROM activities WHERE activity_id = ?");
    $stmt->bind_param("i", $activityId);
    $stmt->execute();
    $stmt->close();

    

    $response = array('status' => 'success', 'message' => 'Activity and associated scores have been deleted');
    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == 'getg_subjects') {
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

if (isset($postjson) && $postjson['aksi'] == 'getg_grades') {
    $studentId = $postjson['studentId'];
    $quarter = $postjson['quarter'];
  
    $stmt = $mysqli->prepare("SELECT grades.grade_id, subjects.subjectname, grades.grade 
                            FROM grades 
                            INNER JOIN subjects ON grades.subject_id = subjects.subject_id 
                            WHERE grades.student_id = ? AND grades.quarter = ?");
    $stmt->bind_param("ss", $studentId,  $quarter);
    $stmt->execute();
    $stmt->bind_result($gradeId, $subjectName, $grade);
  
    $grades = array();
    while ($stmt->fetch()) {
      $remark = $grade >= 75 ? 'PASSED' : 'FAILED'; 
  
      $gradeData = array(
        'grade_id' => $gradeId,
        'student_id' => $studentId,
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
  



  if (isset($postjson) && $postjson['aksi'] == 'add_grades') {
    $gradesToSave = $postjson['grades'];
    $quarter = $postjson['quarter'];
  
    $stmt = $mysqli->prepare("INSERT INTO grades (student_id, subject_id, quarter, grade) VALUES (?, ?, ?, ?)");
  
    foreach ($gradesToSave as $gradeData) {
      $studentId = $gradeData['studentId'];
      $subjectId = $gradeData['subjectId'];
      $grade = $gradeData['grade'];
  
      $stmt->bind_param("ssss", $studentId, $subjectId, $quarter, $grade);
      $stmt->execute();
  
      if ($stmt->affected_rows <= 0) {
        $response = array('status' => 'error', 'message' => 'Failed to add grades');
        echo json_encode($response);
        exit();
      }
    }
  
    $response = array('status' => 'success', 'message' => 'Grades added successfully');
    echo json_encode($response);
    exit();
  
  }
  



  
  if (isset($postjson) && $postjson['aksi'] == 'get_subject_id') {
    $subjectName = $postjson['subjectName'];
  
    $stmt = $mysqli->prepare("SELECT subject_id FROM subjects WHERE subjectname = ?");
    $stmt->bind_param("s", $subjectName);
    $stmt->execute();
    $stmt->bind_result($subjectId);
  
    if ($stmt->fetch()) {
      $response = array('status' => 'success', 'subjectId' => $subjectId);
    } else {
      $response = array('status' => 'error', 'message' => 'Failed to fetch subject ID');
    }
  
    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == 'delete_grades') {
    $studentId = $postjson['studentId'];
    $quarter = $postjson['quarter'];
  
    $stmt = $mysqli->prepare("DELETE FROM grades WHERE student_id = ? AND quarter = ?");
    $stmt->bind_param("ss", $studentId, $quarter);
    $stmt->execute();
  
    if ($stmt->affected_rows > 0) {
      $response = array('status' => 'success', 'message' => 'Grades deleted successfully');
    } else {
      $response = array('status' => 'success', 'message' => 'No grades found to delete');
    }
  
    echo json_encode($response);
    exit();
  }
  



if (isset($postjson) && $postjson['aksi'] == 'fetch_teacher_data') {
    $query = "SELECT * FROM teachers WHERE user_id = ?"; 
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("i", $postjson['teacherId']);
    $stmt->execute();
    $result = $stmt->get_result();

    
    
    if ($result->num_rows > 0) {
      $teacherData = $result->fetch_assoc();
      $response = array('success' => true, 'data' => $teacherData);
    } else {
      $response = array('success' => false, 'msg' => 'Teacher data not found');
    }
    
    echo json_encode($response);
    exit();
  }
  
  if (isset($postjson) && $postjson['aksi'] == 'update_teacher_data') {
    $query = "UPDATE teachers SET firstname = ?, middlename = ?, lastname = ?, address = ?, phone = ?, gender = ?, birthdate = ? WHERE user_id = ?"; 
    $stmt = $mysqli->prepare($query);
    $stmt->bind_param("sssssssi", $postjson['firstName'], $postjson['middleName'], $postjson['lastName'], $postjson['address'], $postjson['phoneNumber'], $postjson['gender'], $postjson['birthdate'], $postjson['teacherId']);
    $stmt->execute();
  
    if ($stmt->affected_rows > 0) {
      $response = array('success' => true, 'msg' => 'Teacher data updated successfully');
    } else {
      $response = array('success' => false, 'msg' => 'Failed to update teacher data');
    }
  
    echo json_encode($response);
    exit();
  }

  if ($_SERVER['REQUEST_METHOD'] === 'POST' && $postjson['aksi'] === 'teacher_change_password') {
    $currentPassword = $postjson['currentPassword'];
    $newPassword = $postjson['newPassword'];
    $teacherId = $postjson['teacherId'];

    $stmt = $mysqli->prepare("SELECT password FROM teachers WHERE user_id = ?");
    $stmt->bind_param("i", $teacherId);
    $stmt->execute();
    $stmt->bind_result($hashedPassword);
    $stmt->fetch();
    $stmt->close();

    if (password_verify($currentPassword, $hashedPassword)) {
        $newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

        $stmt = $mysqli->prepare("UPDATE teachers SET password = ? WHERE user_id = ?");
        $stmt->bind_param("si", $newHashedPassword, $teacherId);
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
  

  
  

  
  








  

  
?>