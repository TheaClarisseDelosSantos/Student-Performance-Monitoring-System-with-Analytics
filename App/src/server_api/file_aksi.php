<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=utf-8");

include "config.php";

$postjson = json_decode(file_get_contents('php://input'), true);


if(isset($postjson) && $postjson['aksi'] == "check_email"){
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

    $stmt = $mysqli->prepare("INSERT INTO users (firstname, middlename, lastname, address, phone, gender, birthdate, gradelevel, section, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssssss", $postjson['fname'], $postjson['mname'], $postjson['lname'], $postjson['address'], $postjson['phone'],$postjson['gender'], $postjson['birthdate'], $postjson['gradelevel'], $postjson['section'], $postjson['email'], $password);
    $stmt->execute();

    if ($stmt->affected_rows > 0) {
        $response = array('success' => true);
    } else {
        $response = array('success' => false, 'msg' => 'Error, please try again');
    }

    echo json_encode($response);

}

if (isset($postjson) && $postjson['aksi'] == "get_grade_levels"){
    $stmt = $mysqli->prepare("SELECT DISTINCT gradelevel FROM sections");
    $stmt->execute();
    $stmt->bind_result($gradeLevel);

    $gradeLevels = array();
    while ($stmt->fetch()){
        $gradeLevels[] = $gradeLevel;
    }

    $response = array('gradeLevels' => $gradeLevels);
    echo json_encode($response);
    exit();
}

if (isset($postjson) && $postjson['aksi'] == "get_sections"){
    $gradeLevel = $postjson['gradeLevel'];

    $stmt = $mysqli->prepare("SELECT sectionname FROM sections WHERE gradelevel = ?");
    $stmt->bind_param("s", $gradeLevel);
    $stmt->execute();
    $stmt->bind_result($sectionName);

    $sections = array();
    while ($stmt->fetch()){
        $sections[] = $sectionName;
    }

    $response = array('sections' => $sections);
    echo json_encode($response);
    exit();

}

if (isset($postjson) && $postjson['aksi'] == "get_grade_levels_sections"){
    $stmt = $mysqli->prepare("SELECT CONCAT(gradelevel, ' - ', sectionname) AS section FROM sections");
    $stmt->execute();
    $stmt->bind_result($gradeLevel);

    $gradeLevels = array();
    while ($stmt->fetch()){
        $gradeLevels[] = $gradeLevel;
    }

    $response = array('gradeLevels' => $gradeLevels);
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

    $stmt = $mysqli->prepare("INSERT INTO teachers (fname, mname, lname, address, phone, gender, birthdate, email, password) VALUES (?,?,?,?,?,?,?,?,?)");
    $stmt->bind_param("sssssssss",$postjson['fname'],$postjson['mname'],$postjson['lname'],$postjson['address'],$postjson['phone'],$postjson['gender'],$postjson['birthdate'],$postjson['email'],$password);
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