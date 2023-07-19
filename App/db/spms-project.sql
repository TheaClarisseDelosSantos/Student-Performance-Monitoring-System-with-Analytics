-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 19, 2023 at 01:05 PM
-- Server version: 10.4.25-MariaDB
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `spms-project`
--

-- --------------------------------------------------------

--
-- Table structure for table `activities`
--

CREATE TABLE `activities` (
  `activity_id` int(11) NOT NULL,
  `activity_name` varchar(150) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `activities`
--

INSERT INTO `activities` (`activity_id`, `activity_name`, `subject_id`, `section_id`, `date`) VALUES
(1, 'Activity 1', 1, 4, '2023-07-11'),
(2, 'Quiz 1', 3, 4, '2023-07-13'),
(3, 'Quiz 2', 1, 4, '2023-07-14'),
(4, 'Activity 2 - Writing', 1, 4, '2023-07-06'),
(5, 'Quiz 3', 4, 3, '2023-07-16'),
(6, 'Activity 4', 4, 3, '2023-07-16'),
(7, 'Activity 5', 4, 3, '2023-07-16'),
(8, 'Test', 4, 3, '2023-07-16'),
(9, 'Test2', 4, 3, '2023-07-16'),
(10, 'Test2', 4, 3, '2023-07-16'),
(11, 'Test2', 4, 3, '2023-07-16'),
(12, 'test3', 4, 3, '2023-07-16'),
(25, 'Activity 1', 4, 3, '2023-07-17'),
(26, 'Quiz 2', 5, 3, '2023-07-17'),
(27, 'Activity 2 ', 4, 3, '2023-07-17');

-- --------------------------------------------------------

--
-- Table structure for table `assign_teacher`
--

CREATE TABLE `assign_teacher` (
  `assign_id` int(11) NOT NULL,
  `teacher_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `assign_teacher`
--

INSERT INTO `assign_teacher` (`assign_id`, `teacher_id`, `section_id`, `subject_id`) VALUES
(9, 6, 5, 2),
(10, 6, 3, 4),
(11, 6, 3, 5),
(12, 7, 1, 3),
(13, 8, 5, 4),
(14, 8, 5, 6);

-- --------------------------------------------------------

--
-- Table structure for table `enrollments`
--

CREATE TABLE `enrollments` (
  `enrollment_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `grades`
--

CREATE TABLE `grades` (
  `grade_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `subject_id` int(11) NOT NULL,
  `quarter` varchar(100) NOT NULL,
  `grade` varchar(50) NOT NULL,
  `remarks` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `grades`
--

INSERT INTO `grades` (`grade_id`, `student_id`, `subject_id`, `quarter`, `grade`, `remarks`) VALUES
(1, 9, 1, 'First Quarter', '95', ''),
(2, 9, 2, 'First Quarter', '90', ''),
(3, 9, 5, 'Second Quarter', '89', ''),
(126, 10, 6, 'Second Quarter', '90', ''),
(127, 10, 1, 'Second Quarter', '99', ''),
(128, 10, 2, 'Second Quarter', '98', ''),
(129, 10, 3, 'Second Quarter', '87', ''),
(130, 10, 4, 'Second Quarter', '90', ''),
(131, 10, 5, 'Second Quarter', '98', ''),
(138, 14, 6, 'Second Quarter', '89', ''),
(139, 14, 2, 'Second Quarter', '93', ''),
(140, 14, 3, 'Second Quarter', '91', ''),
(141, 14, 5, 'Second Quarter', '91', ''),
(142, 14, 4, 'Second Quarter', '90', ''),
(143, 14, 1, 'Second Quarter', '91', ''),
(228, 10, 5, 'Third Quarter', '95', ''),
(229, 10, 6, 'Third Quarter', '97', ''),
(230, 10, 2, 'Third Quarter', '96', ''),
(231, 10, 3, 'Third Quarter', '93', ''),
(232, 10, 4, 'Third Quarter', '92', ''),
(233, 10, 1, 'Third Quarter', '99', ''),
(240, 14, 1, 'First Quarter', '95', ''),
(241, 14, 2, 'First Quarter', '98', ''),
(242, 14, 3, 'First Quarter', '97', ''),
(243, 14, 6, 'First Quarter', '95', ''),
(244, 14, 4, 'First Quarter', '96', ''),
(245, 14, 5, 'First Quarter', '95', '');

-- --------------------------------------------------------

--
-- Table structure for table `scores`
--

CREATE TABLE `scores` (
  `score_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `score_value` varchar(50) NOT NULL,
  `status_value` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `scores`
--

INSERT INTO `scores` (`score_id`, `activity_id`, `user_id`, `score_value`, `status_value`) VALUES
(2, 1, 9, '30/30', 'Completed'),
(3, 2, 9, '10/40', 'Failed'),
(4, 3, 9, '---', 'Missing'),
(5, 4, 9, '25/30', 'Completed'),
(18, 25, 10, '--', 'missing'),
(19, 26, 10, '20/20', 'completed'),
(20, 27, 10, '20/20', 'completed');

-- --------------------------------------------------------

--
-- Table structure for table `sections`
--

CREATE TABLE `sections` (
  `section_id` int(11) NOT NULL,
  `gradelevel` varchar(50) NOT NULL,
  `sectionname` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `sections`
--

INSERT INTO `sections` (`section_id`, `gradelevel`, `sectionname`) VALUES
(1, 'Grade 7', 'Noah'),
(2, 'Grade 7', 'Moises'),
(3, 'Grade 7', 'Abraham'),
(4, 'Grade 8', 'John'),
(5, 'Grade 9', 'Peter');

-- --------------------------------------------------------

--
-- Table structure for table `subjects`
--

CREATE TABLE `subjects` (
  `subject_id` int(11) NOT NULL,
  `subjectname` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `subjects`
--

INSERT INTO `subjects` (`subject_id`, `subjectname`) VALUES
(1, 'English'),
(2, 'Mathematics'),
(3, 'Filipino'),
(4, 'Araling Panlipunan'),
(5, 'Science'),
(6, 'Edukasyon sa Pagpapakatao');

-- --------------------------------------------------------

--
-- Table structure for table `teachers`
--

CREATE TABLE `teachers` (
  `user_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `address` varchar(50) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `gender` varchar(10) NOT NULL,
  `birthdate` date NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `teachers`
--

INSERT INTO `teachers` (`user_id`, `section_id`, `firstname`, `middlename`, `lastname`, `address`, `phone`, `gender`, `birthdate`, `email`, `password`) VALUES
(6, 1, 'Perla', 'Perez', 'Delos Santos', 'San Roque', '09123213121', 'female', '2023-07-15', 'perla@gmail.com', '$2y$10$3v5y.V9pkCCiQpHHlK9yde/.3cpwqSA0yrQsy5drHKxEYcCFnH3Fm'),
(7, 4, 'Katherine', 'Perez', 'Delos Santos ', 'Test1', '12312313123', 'female', '2023-07-01', 'kaye@gmail.com', '$2y$10$a7yCzNqjYpxa8FcL8hYghuOKx4Fpjk7kW90Jxu2R4MJ2FS/hk2Gp2'),
(8, 5, 'John Michael', 'Perez', 'Delos Santos', 'San Roque', '09123123123', 'male', '2023-07-14', 'jm@gmail.com', '$2y$10$HMyPxW3EeDQCEBggl2vRt.wPI.Xf0AJc6UiYu3lb2rNzMDEFrRBta');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) DEFAULT NULL,
  `lastname` varchar(50) NOT NULL,
  `address` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `gender` varchar(10) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `section_id`, `firstname`, `middlename`, `lastname`, `address`, `phone`, `gender`, `birthdate`, `email`, `password`) VALUES
(8, 1, 'Test1', 'Test1', 'Test1', 'Test1', '11111111111', 'female', '2023-07-06', 'test1@gmail.com', '$2y$10$Szz9SbiA17XPwOV40/FLNuWqXBAPQNdX7IT3tQrKHlM5yeezgmSCy'),
(9, 4, 'Thea', 'Perez', 'Delos Santoss', 'San Roque', '09083444771', 'female', '2002-03-03', 'thea@gmail.com', '$2y$10$qXgxj8ClZueg7BNy1Lq3Iuiw2j2t9Ety1MDMjxHWBcZe.la5MMXHm'),
(10, 3, 'Keanne', '', 'Lopez', 'Namuco, Rosario, Batangas', '09123432424', 'female', '2023-07-06', 'klopez@gmail.com', '$2y$10$vJIKDeVDF7CgE7znCdhOWOu5aHexzWfWNz4fWxMKI6XJkR/orZ4DO'),
(11, 5, 'Jussel', '', 'Elejorde', 'San Antonio', '11312312313', 'female', '2023-07-06', 'jussel@gmail.com', '$2y$10$PgYJArvQXVyIYau1/klxIOYCOt7QlU3MgzsOdx7bO9fNIq1psPYCW'),
(12, 2, 'Test1', 'Test1', 'Test1', 'Test1', '09123123123', 'female', '2023-07-14', 'test2@gmail.com', '$2y$10$VUBrzBIVUuV0OZqDNVxEWuTcp5yS11IWLCy//cJtMggIMRPQMjI0K'),
(13, 5, 'Kaycee', '', 'Panaligan', 'Batangas City', '09112312312', 'Female', '2023-07-07', 'kaycee@gmail.com', '$2y$10$qmM8HOQ5inAajIHyoY.G9es6ZzGzAE6aFBfuIdjFy/xzAMFBjgT9a'),
(14, 3, 'Janelle', '', 'De Chavez', 'Batangas City', '12312312313', 'Female', '2023-07-21', 'janelle@gmail.com', '$2y$10$8mzaYGDbIshesVDMkIHjcOiV1nDrWxcDFWsLNsK5gfQZz5OJ3T/..'),
(15, 3, 'Thea Clarisse', 'Perez', 'Delos Santos', 'San Roque, Rosario, Batangas', '09083444771', 'Female', '2023-07-29', 'thead@gmail.com', '$2y$10$al9PWgkknwGe54vCVT4K5ubyHi8HP0vTaII1M/s9YAOD72FP/slNu'),
(16, 3, 'Michael', NULL, 'Padua', 'Padre Garcia, Batangas', '09123434343', 'Male', '2002-04-03', 'michael@gmail.com', '$2y$10$tX/7lGbeiTATVTsX2wmpI.57.wr9NGjU6Py5sY56h7WJh3u.Hj5Ey'),
(17, 3, 'Alvin', 'Elejorde', 'Arpia', 'Rosario, Batangas', '09877665534', 'Male', '2002-07-19', 'alvin@gmail.com', '$2y$10$U/DH40HODLOqT374ZPKdP.LZkiue0czMRFD1IOZ6cpe5Vg3Kd4Qo6'),
(18, 3, 'Angelica', 'Morales', 'Alapaap', 'Padre Garcia, Batangas', '09126597987', 'Female', '2002-01-02', 'angelica@gmail.com', '$2y$10$z5UlgcAnToQWeb0gQLWi5.99fiLYijzKkOXQsNwhPLPc4y9ZcTgDe'),
(19, 3, 'Morienda', NULL, 'Alagito', 'Alangilan, Batangas City', '09145678678', 'Female', '2002-04-03', 'morienda@gmail.com', '$2y$10$TtKKw5nHvaPfB4jWVVGJuOtVjuxvX/MTYsMs3ZXE6lB8m/ItM0zYa'),
(20, 3, 'Kenneth', '', 'Mindanao', 'Namuco, Rosario, Batangas', '09234234324', 'Male', '2000-04-29', 'kenneth@gmail.com', '$2y$10$bg2VS54n805qKaxokRnxTOLssD8sppoP2Av/TkHqnCzKZdUznLelG'),
(21, 5, 'Joseph', NULL, 'Cortez', 'Batangas City', '09123123131', 'Male', '2002-01-16', 'joseph@gmail.com', '$2y$10$WbkpxoApHR3S3q15.2aysOrXCkpc4bfjdDABXZA2MbJZ6ZOMWGGKi');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activities`
--
ALTER TABLE `activities`
  ADD PRIMARY KEY (`activity_id`),
  ADD KEY `act_fk1` (`section_id`),
  ADD KEY `act_fk2` (`subject_id`);

--
-- Indexes for table `assign_teacher`
--
ALTER TABLE `assign_teacher`
  ADD PRIMARY KEY (`assign_id`),
  ADD KEY `assign_fk1` (`section_id`),
  ADD KEY `assign_fk2` (`subject_id`),
  ADD KEY `assign_fk3` (`teacher_id`);

--
-- Indexes for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD KEY `enroll_fk1` (`subject_id`),
  ADD KEY `enroll_fk2` (`user_id`);

--
-- Indexes for table `grades`
--
ALTER TABLE `grades`
  ADD PRIMARY KEY (`grade_id`),
  ADD KEY `grade_fk1` (`student_id`),
  ADD KEY `grade_fk2` (`subject_id`);

--
-- Indexes for table `scores`
--
ALTER TABLE `scores`
  ADD PRIMARY KEY (`score_id`),
  ADD KEY `score_fk1` (`activity_id`),
  ADD KEY `score_fk2` (`user_id`);

--
-- Indexes for table `sections`
--
ALTER TABLE `sections`
  ADD PRIMARY KEY (`section_id`);

--
-- Indexes for table `subjects`
--
ALTER TABLE `subjects`
  ADD PRIMARY KEY (`subject_id`);

--
-- Indexes for table `teachers`
--
ALTER TABLE `teachers`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `teacher_fk1` (`section_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD KEY `user_fk1` (`section_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activities`
--
ALTER TABLE `activities`
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `assign_teacher`
--
ALTER TABLE `assign_teacher`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `grades`
--
ALTER TABLE `grades`
  MODIFY `grade_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=246;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `score_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `sections`
--
ALTER TABLE `sections`
  MODIFY `section_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `subjects`
--
ALTER TABLE `subjects`
  MODIFY `subject_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `teachers`
--
ALTER TABLE `teachers`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activities`
--
ALTER TABLE `activities`
  ADD CONSTRAINT `act_fk1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`),
  ADD CONSTRAINT `act_fk2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`);

--
-- Constraints for table `assign_teacher`
--
ALTER TABLE `assign_teacher`
  ADD CONSTRAINT `assign_fk1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`),
  ADD CONSTRAINT `assign_fk2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  ADD CONSTRAINT `assign_fk3` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`user_id`);

--
-- Constraints for table `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enroll_fk1` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`),
  ADD CONSTRAINT `enroll_fk2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `grades`
--
ALTER TABLE `grades`
  ADD CONSTRAINT `grade_fk1` FOREIGN KEY (`student_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `grade_fk2` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`subject_id`);

--
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `score_fk1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`),
  ADD CONSTRAINT `score_fk2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `teachers`
--
ALTER TABLE `teachers`
  ADD CONSTRAINT `teacher_fk1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `user_fk1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
