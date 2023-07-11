-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 11, 2023 at 08:03 PM
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
(3, 'Quiz 2', 1, 4, '2023-07-14');

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
(1, 1, 5, 1),
(2, 1, 5, 2),
(3, 1, 3, 1),
(4, 1, 3, 2),
(5, 3, 5, 1),
(6, 3, 5, 2),
(7, 4, 3, 1);

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
(4, 3, 9, '---', 'Missing');

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

INSERT INTO `teachers` (`user_id`, `firstname`, `middlename`, `lastname`, `address`, `phone`, `gender`, `birthdate`, `email`, `password`) VALUES
(1, 'Keanne', 'Ebrado', 'Lopez', 'Namuco, Rosario, Batangas', '09123456789', 'female', '2002-03-17', 'klopez@gmail.com', '$2y$10$7NVOgK1NMe8ACU.Th/ies.XS/7fdFjP1SnnIvrtXnhZ'),
(3, 'Test4', 'Test4', 'Test4', 'Test4', '09123432423', 'female', '2023-07-22', 'test4@gmail.com', '$2y$10$BakHNd5HVivvq2VHSQeq.ebvqGTGA6m2HHNkylmakVb'),
(4, 'Test5', 'Test5', 'Test5', 'Test5', '12345677890', 'female', '2023-07-07', 'test5@gmail.com', '$2y$10$Kg8pgJGvX0KElt3xfUeaoe5Tn1hPYIzWO1NzE5meheD0PyIMnKadO');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `user_id` int(11) NOT NULL,
  `section_id` int(11) NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `middlename` varchar(50) NOT NULL,
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
(9, 4, 'Thea', 'Perez', 'Delos Santos', 'San Roque', '09083444771', 'female', '2002-03-03', 'thea@gmail.com', '$2y$10$3LZ1ecgUyvaZcrHyYdhYpO/ftDgpUUZ8tRcvGQ1SoUwxg6h9XxI4K'),
(10, 3, 'Keanne', '', 'Lopez', 'Namuco, Rosario, Batangas', '09123432424', 'female', '2023-07-06', 'klopez@gmail.com', '$2y$10$vJIKDeVDF7CgE7znCdhOWOu5aHexzWfWNz4fWxMKI6XJkR/orZ4DO');

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
  ADD PRIMARY KEY (`user_id`);

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
  MODIFY `activity_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `assign_teacher`
--
ALTER TABLE `assign_teacher`
  MODIFY `assign_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `scores`
--
ALTER TABLE `scores`
  MODIFY `score_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
-- Constraints for table `scores`
--
ALTER TABLE `scores`
  ADD CONSTRAINT `score_fk1` FOREIGN KEY (`activity_id`) REFERENCES `activities` (`activity_id`),
  ADD CONSTRAINT `score_fk2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`);

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `user_fk1` FOREIGN KEY (`section_id`) REFERENCES `sections` (`section_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
