-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 26, 2026 at 08:15 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `nilm_capstone`
--

-- --------------------------------------------------------

--
-- Table structure for table `tblalerts`
--

CREATE TABLE `tblalerts` (
  `alert_id` int(11) NOT NULL,
  `alert_room_id` int(11) DEFAULT NULL,
  `alert_type` varchar(50) DEFAULT NULL,
  `alert_message` text DEFAULT NULL,
  `alert_status` enum('new','resolved') DEFAULT 'new',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblalerts`
--

INSERT INTO `tblalerts` (`alert_id`, `alert_room_id`, `alert_type`, `alert_message`, `alert_status`, `created_at`) VALUES
(1, 1, 'HIGH_THD', 'High harmonic distortion detected', 'new', '2026-02-27 01:44:29'),
(2, 2, 'HIGH_POWER', 'Power exceeded expected range', 'new', '2026-02-27 01:44:29');

-- --------------------------------------------------------

--
-- Table structure for table `tblappliances`
--

CREATE TABLE `tblappliances` (
  `appliance_id` int(11) NOT NULL,
  `appliance_user_id` int(11) NOT NULL,
  `appliance_device_id` int(11) NOT NULL,
  `appliance_type_id` int(11) NOT NULL,
  `appliance_custom_name` varchar(100) DEFAULT NULL,
  `appliance_icon` varchar(16) DEFAULT NULL,
  `appliance_port_number` int(11) DEFAULT NULL,
  `appliance_is_active` tinyint(1) DEFAULT 0,
  `appliance_usage_minutes` decimal(10,2) DEFAULT 0.00,
  `appliance_last_detected` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblappliances`
--

INSERT INTO `tblappliances` (`appliance_id`, `appliance_user_id`, `appliance_device_id`, `appliance_type_id`, `appliance_custom_name`, `appliance_icon`, `appliance_port_number`, `appliance_is_active`, `appliance_usage_minutes`, `appliance_last_detected`, `created_at`, `updated_at`) VALUES
(1, 6, 4, 1, NULL, '❄️', 1, 1, 0.00, NULL, '2026-02-27 02:22:04', '2026-02-27 02:22:15'),
(2, 6, 4, 3, NULL, '🧊', 2, 1, 0.00, NULL, '2026-02-27 02:22:04', '2026-02-27 02:22:14'),
(3, 6, 4, 2, NULL, '🌀', 3, 1, 0.00, NULL, '2026-02-27 02:22:04', '2026-02-27 02:22:13'),
(4, 6, 4, 5, NULL, '📺', 4, 1, 0.00, NULL, '2026-02-27 02:22:04', '2026-02-27 02:22:13'),
(5, 6, 4, 4, NULL, '🍚', 5, 1, 0.00, NULL, '2026-02-27 02:22:04', '2026-02-27 02:22:12'),
(6, 6, 4, 6, NULL, '💻', 6, 1, 0.00, NULL, '2026-02-27 02:22:04', '2026-02-27 02:22:12'),
(7, 6, 4, 7, NULL, '💡', 7, 1, 0.00, NULL, '2026-02-27 02:22:04', '2026-02-27 02:22:11'),
(9, 6, 5, 1, NULL, '❄️', 1, 1, 0.00, NULL, '2026-02-27 02:28:23', '2026-02-27 02:29:50'),
(10, 6, 5, 3, NULL, '🧊', 2, 1, 0.00, NULL, '2026-02-27 02:29:15', '2026-02-27 02:30:10'),
(11, 7, 6, 1, NULL, '❄️', 1, 0, 0.00, NULL, '2026-02-27 02:50:04', '2026-02-27 02:50:04'),
(12, 7, 6, 3, NULL, '🧊', 2, 0, 0.00, NULL, '2026-02-27 02:50:04', '2026-02-27 02:50:04'),
(13, 7, 6, 2, NULL, '🌀', 3, 0, 0.00, NULL, '2026-02-27 02:50:04', '2026-02-27 02:50:04'),
(14, 7, 6, 5, NULL, '📺', 4, 0, 0.00, NULL, '2026-02-27 02:50:04', '2026-02-27 02:50:04'),
(15, 7, 6, 4, NULL, '🍚', 5, 0, 0.00, NULL, '2026-02-27 02:50:04', '2026-02-27 02:50:04'),
(16, 7, 6, 6, NULL, '💻', 6, 0, 0.00, NULL, '2026-02-27 02:50:04', '2026-02-27 02:50:04'),
(17, 7, 6, 7, NULL, '💡', 7, 0, 0.00, NULL, '2026-02-27 02:50:04', '2026-02-27 02:50:04');

-- --------------------------------------------------------

--
-- Table structure for table `tblappliance_categories`
--

CREATE TABLE `tblappliance_categories` (
  `category_id` int(11) NOT NULL,
  `category_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblappliance_categories`
--

INSERT INTO `tblappliance_categories` (`category_id`, `category_name`) VALUES
(5, 'Computing'),
(1, 'Cooling'),
(3, 'Entertainment'),
(2, 'Kitchen'),
(4, 'Lighting');

-- --------------------------------------------------------

--
-- Table structure for table `tblappliance_detection_details`
--

CREATE TABLE `tblappliance_detection_details` (
  `detection_detail_id` int(11) NOT NULL,
  `detection_detail_header_id` int(11) DEFAULT NULL,
  `detection_detail_appliance_type_id` int(11) DEFAULT NULL,
  `detection_detail_status` enum('ON','OFF') DEFAULT NULL,
  `detection_detail_confidence` decimal(5,2) DEFAULT NULL,
  `detection_detail_detected_power` decimal(10,2) DEFAULT NULL,
  `detection_detail_detected_frequency` decimal(10,2) DEFAULT NULL,
  `detection_detail_detected_thd` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblappliance_detection_details`
--

INSERT INTO `tblappliance_detection_details` (`detection_detail_id`, `detection_detail_header_id`, `detection_detail_appliance_type_id`, `detection_detail_status`, `detection_detail_confidence`, `detection_detail_detected_power`, `detection_detail_detected_frequency`, `detection_detail_detected_thd`) VALUES
(1, 1, 1, 'ON', 0.93, 1180.00, 60.02, 13.00),
(2, 2, 4, 'ON', 0.89, 710.00, 60.01, 3.10),
(3, 3, 5, 'ON', 0.91, 120.00, 59.98, 17.50),
(4, 4, 7, 'ON', 0.90, 53.93, 60.01, 0.00),
(5, 4, 6, 'ON', 0.90, 200.24, 60.01, 0.00),
(6, 4, 5, 'ON', 0.90, 675.45, 60.01, 0.00),
(7, 4, 4, 'ON', 0.90, 120.65, 60.01, 0.00),
(8, 4, 3, 'ON', 0.90, 68.14, 60.01, 0.00),
(9, 4, 2, 'ON', 0.90, 142.06, 60.01, 0.00),
(10, 4, 1, 'ON', 0.90, 1274.45, 60.01, 0.00),
(11, 5, 7, 'ON', 0.90, 48.96, 60.04, 0.00),
(12, 5, 6, 'ON', 0.90, 196.37, 60.04, 0.00),
(13, 5, 5, 'ON', 0.90, 707.32, 60.04, 0.00),
(14, 5, 4, 'ON', 0.90, 100.18, 60.04, 0.00),
(15, 5, 3, 'ON', 0.90, 70.71, 60.04, 0.00),
(16, 5, 2, 'ON', 0.90, 154.80, 60.04, 0.00),
(17, 5, 1, 'ON', 0.90, 1338.97, 60.04, 0.00),
(18, 6, 7, 'ON', 0.90, 47.49, 59.91, 0.00),
(19, 6, 6, 'ON', 0.90, 201.59, 59.91, 0.00),
(20, 6, 5, 'ON', 0.90, 717.22, 59.91, 0.00),
(21, 6, 4, 'ON', 0.90, 101.64, 59.91, 0.00),
(22, 6, 3, 'ON', 0.90, 73.65, 59.91, 0.00),
(23, 6, 2, 'ON', 0.90, 145.99, 59.91, 0.00),
(24, 6, 1, 'ON', 0.90, 1198.00, 59.91, 0.00),
(25, 7, 7, 'ON', 0.90, 49.06, 60.01, 0.00),
(26, 7, 6, 'ON', 0.90, 153.76, 60.01, 0.00),
(27, 7, 5, 'ON', 0.90, 691.87, 60.01, 0.00),
(28, 7, 4, 'ON', 0.90, 87.40, 60.01, 0.00),
(29, 7, 3, 'ON', 0.90, 87.36, 60.01, 0.00),
(30, 7, 2, 'ON', 0.90, 167.38, 60.01, 0.00),
(31, 7, 1, 'ON', 0.90, 1271.76, 60.01, 0.00),
(32, 8, 7, 'ON', 0.90, 45.97, 60.04, 0.00),
(33, 8, 6, 'ON', 0.90, 144.59, 60.04, 0.00),
(34, 8, 5, 'ON', 0.90, 606.59, 60.04, 0.00),
(35, 8, 4, 'ON', 0.90, 75.34, 60.04, 0.00),
(36, 8, 3, 'ON', 0.90, 81.11, 60.04, 0.00),
(37, 8, 2, 'ON', 0.90, 154.67, 60.04, 0.00),
(38, 8, 1, 'ON', 0.90, 1210.26, 60.04, 0.00),
(68, 38, 7, 'OFF', 0.90, 60.00, 60.07, 0.00),
(69, 38, 6, 'OFF', 0.90, 200.00, 60.07, 0.00),
(70, 38, 4, 'OFF', 0.90, 700.00, 60.07, 0.00),
(71, 38, 5, 'OFF', 0.90, 120.00, 60.07, 0.00),
(72, 38, 2, 'OFF', 0.90, 75.00, 60.07, 0.00),
(73, 38, 3, 'OFF', 0.90, 150.00, 60.07, 0.00),
(74, 38, 1, 'OFF', 0.90, 1200.00, 60.07, 0.00),
(75, 39, 3, 'ON', 0.90, 146.80, 59.92, 0.00),
(76, 39, 1, 'ON', 0.90, 1323.08, 59.92, 0.00),
(77, 40, 3, 'ON', 0.90, 143.11, 60.08, 0.00),
(78, 40, 1, 'ON', 0.90, 1111.42, 60.08, 0.00),
(79, 41, 3, 'ON', 0.90, 144.50, 59.98, 0.00),
(80, 41, 1, 'ON', 0.90, 1206.20, 59.98, 0.00),
(81, 42, 3, 'ON', 0.90, 145.27, 60.03, 0.00),
(82, 42, 1, 'ON', 0.90, 1077.97, 60.03, 0.00),
(83, 43, 3, 'ON', 0.90, 148.84, 59.95, 0.00),
(84, 43, 1, 'ON', 0.90, 1331.55, 59.95, 0.00),
(85, 44, 3, 'ON', 0.90, 154.24, 59.95, 0.00),
(86, 44, 1, 'ON', 0.90, 996.89, 59.95, 0.00),
(87, 45, 3, 'ON', 0.90, 135.17, 59.96, 0.00),
(88, 45, 1, 'ON', 0.90, 1343.31, 59.96, 0.00),
(89, 46, 3, 'ON', 0.90, 139.60, 60.06, 0.00),
(90, 46, 1, 'ON', 0.90, 1162.47, 60.06, 0.00),
(91, 47, 3, 'ON', 0.90, 127.94, 59.99, 0.00),
(92, 47, 1, 'ON', 0.90, 1442.10, 59.99, 0.00),
(93, 48, 3, 'ON', 0.90, 134.13, 59.94, 0.00),
(94, 48, 1, 'ON', 0.90, 1283.87, 59.94, 0.00),
(95, 49, 3, 'ON', 0.90, 163.47, 60.08, 0.00),
(96, 49, 1, 'ON', 0.90, 1140.51, 60.08, 0.00),
(97, 50, 3, 'ON', 0.90, 168.13, 60.01, 0.00),
(98, 50, 1, 'ON', 0.90, 1170.43, 60.01, 0.00),
(99, 51, 3, 'ON', 0.90, 202.38, 59.99, 0.00),
(100, 51, 1, 'ON', 0.90, 1283.01, 59.99, 0.00),
(101, 52, 3, 'ON', 0.90, 179.82, 60.03, 0.00),
(102, 52, 1, 'ON', 0.90, 1485.15, 60.03, 0.00),
(103, 53, 3, 'ON', 0.90, 207.56, 60.05, 0.00),
(104, 53, 1, 'ON', 0.90, 1338.19, 60.05, 0.00),
(105, 54, 3, 'ON', 0.90, 212.76, 60.07, 0.00),
(106, 54, 1, 'ON', 0.90, 1404.91, 60.07, 0.00),
(107, 55, 3, 'ON', 0.90, 179.84, 59.93, 0.00),
(108, 55, 1, 'ON', 0.90, 1491.19, 59.93, 0.00),
(109, 56, 3, 'ON', 0.90, 188.67, 59.99, 0.00),
(110, 56, 1, 'ON', 0.90, 1460.63, 59.99, 0.00),
(111, 57, 3, 'ON', 0.90, 161.92, 60.00, 0.00),
(112, 57, 1, 'ON', 0.90, 1449.00, 60.00, 0.00),
(113, 58, 3, 'ON', 0.90, 124.77, 59.94, 0.00),
(114, 58, 1, 'ON', 0.90, 1539.67, 59.94, 0.00),
(115, 59, 3, 'ON', 0.90, 110.99, 60.01, 0.00),
(116, 59, 1, 'ON', 0.90, 1500.14, 60.01, 0.00),
(117, 60, 3, 'ON', 0.90, 133.46, 60.08, 0.00),
(118, 60, 1, 'ON', 0.90, 1083.66, 60.08, 0.00),
(119, 61, 3, 'ON', 0.90, 136.58, 59.98, 0.00),
(120, 61, 1, 'ON', 0.90, 1186.49, 59.98, 0.00),
(121, 62, 3, 'ON', 0.90, 114.71, 59.94, 0.00),
(122, 62, 1, 'ON', 0.90, 1312.03, 59.94, 0.00),
(123, 63, 3, 'ON', 0.90, 105.21, 60.08, 0.00),
(124, 63, 1, 'ON', 0.90, 1284.11, 60.08, 0.00),
(125, 64, 3, 'ON', 0.90, 111.38, 59.92, 0.00),
(126, 64, 1, 'ON', 0.90, 1060.18, 59.92, 0.00),
(127, 65, 3, 'ON', 0.90, 118.83, 59.97, 0.00),
(128, 65, 1, 'ON', 0.90, 1073.57, 59.97, 0.00),
(129, 66, 3, 'ON', 0.90, 121.62, 59.93, 0.00),
(130, 66, 1, 'ON', 0.90, 975.13, 59.93, 0.00),
(131, 67, 3, 'ON', 0.90, 118.50, 60.08, 0.00),
(132, 67, 1, 'ON', 0.90, 1158.34, 60.08, 0.00),
(133, 68, 3, 'ON', 0.90, 120.35, 59.97, 0.00),
(134, 68, 1, 'ON', 0.90, 1135.32, 59.97, 0.00),
(135, 69, 3, 'ON', 0.90, 145.65, 60.06, 0.00),
(136, 69, 1, 'ON', 0.90, 1234.96, 60.06, 0.00),
(137, 70, 3, 'ON', 0.90, 139.14, 59.96, 0.00),
(138, 70, 1, 'ON', 0.90, 1230.73, 59.96, 0.00),
(139, 71, 3, 'ON', 0.90, 158.36, 60.05, 0.00),
(140, 71, 1, 'ON', 0.90, 1348.46, 60.05, 0.00),
(141, 72, 3, 'ON', 0.90, 166.00, 60.09, 0.00),
(142, 72, 1, 'ON', 0.90, 1672.24, 60.09, 0.00),
(143, 73, 3, 'ON', 0.90, 149.00, 59.99, 0.00),
(144, 73, 1, 'ON', 0.90, 1738.48, 59.99, 0.00),
(145, 74, 3, 'ON', 0.90, 149.75, 59.93, 0.00),
(146, 74, 1, 'ON', 0.90, 1182.64, 59.93, 0.00),
(147, 75, 3, 'ON', 0.90, 143.82, 60.02, 0.00),
(148, 75, 1, 'ON', 0.90, 1010.95, 60.02, 0.00),
(149, 76, 3, 'ON', 0.90, 119.21, 60.07, 0.00),
(150, 76, 1, 'ON', 0.90, 897.88, 60.07, 0.00),
(151, 77, 3, 'ON', 0.90, 105.51, 60.06, 0.00),
(152, 77, 1, 'ON', 0.90, 1041.24, 60.06, 0.00),
(153, 78, 3, 'ON', 0.90, 103.50, 60.02, 0.00),
(154, 78, 1, 'ON', 0.90, 936.57, 60.02, 0.00),
(155, 79, 3, 'ON', 0.90, 78.92, 60.04, 0.00),
(156, 79, 1, 'ON', 0.90, 960.15, 60.04, 0.00);

-- --------------------------------------------------------

--
-- Table structure for table `tblappliance_detection_headers`
--

CREATE TABLE `tblappliance_detection_headers` (
  `detection_header_id` int(11) NOT NULL,
  `detection_header_room_id` int(11) DEFAULT NULL,
  `detection_header_reading_header_id` int(11) DEFAULT NULL,
  `detection_header_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblappliance_detection_headers`
--

INSERT INTO `tblappliance_detection_headers` (`detection_header_id`, `detection_header_room_id`, `detection_header_reading_header_id`, `detection_header_time`) VALUES
(1, 1, 1, '2026-02-27 01:44:29'),
(2, 2, 2, '2026-02-27 01:44:29'),
(3, 3, 3, '2026-02-27 01:44:29'),
(4, 4, 4, '2026-02-27 02:22:33'),
(5, 4, 5, '2026-02-27 02:23:03'),
(6, 4, 6, '2026-02-27 02:23:33'),
(7, 4, 7, '2026-02-27 02:24:03'),
(8, 4, 8, '2026-02-27 02:24:33'),
(9, 4, 9, '2026-02-27 02:29:03'),
(10, 4, 10, '2026-02-27 02:29:33'),
(11, 4, 11, '2026-02-27 02:30:18'),
(12, 4, 12, '2026-02-27 02:30:48'),
(13, 4, 13, '2026-02-27 02:31:18'),
(14, 4, 14, '2026-02-27 02:40:24'),
(15, 4, 15, '2026-02-27 02:40:54'),
(16, 4, 16, '2026-02-27 02:41:24'),
(17, 4, 17, '2026-02-27 02:41:54'),
(18, 4, 18, '2026-02-27 02:42:24'),
(19, 4, 19, '2026-02-27 02:42:54'),
(20, 4, 20, '2026-02-27 02:43:20'),
(21, 4, 21, '2026-02-27 02:43:24'),
(22, 4, 22, '2026-02-27 02:43:54'),
(23, 4, 23, '2026-02-27 02:44:17'),
(24, 4, 24, '2026-02-27 02:44:24'),
(25, 4, 25, '2026-02-27 02:44:47'),
(26, 4, 26, '2026-02-27 02:44:54'),
(27, 4, 27, '2026-02-27 02:45:18'),
(28, 4, 28, '2026-02-27 02:45:24'),
(29, 4, 29, '2026-02-27 02:45:51'),
(30, 4, 30, '2026-02-27 02:46:27'),
(31, 4, 31, '2026-02-27 02:46:40'),
(32, 4, 32, '2026-02-27 02:47:27'),
(33, 4, 33, '2026-02-27 02:47:35'),
(34, 4, 34, '2026-02-27 02:48:05'),
(35, 4, 35, '2026-02-27 02:48:35'),
(36, 4, 36, '2026-02-27 02:48:40'),
(37, 4, 37, '2026-02-27 02:49:10'),
(38, 5, 38, '2026-02-27 02:50:21'),
(39, 4, 39, '2026-02-27 02:51:12'),
(40, 4, 40, '2026-02-27 02:51:30'),
(41, 4, 41, '2026-02-27 02:52:00'),
(42, 4, 42, '2026-02-27 02:52:30'),
(43, 4, 43, '2026-02-27 02:52:35'),
(44, 4, 44, '2026-02-27 02:53:00'),
(45, 4, 45, '2026-02-27 02:53:33'),
(46, 4, 46, '2026-02-27 02:53:37'),
(47, 4, 47, '2026-02-27 02:54:07'),
(48, 4, 48, '2026-02-27 02:54:12'),
(49, 4, 49, '2026-02-27 02:54:53'),
(50, 4, 50, '2026-02-27 02:55:23'),
(51, 4, 51, '2026-02-27 02:55:53'),
(52, 4, 52, '2026-02-27 02:56:23'),
(53, 4, 53, '2026-02-27 02:56:53'),
(54, 4, 54, '2026-02-27 02:57:23'),
(55, 4, 55, '2026-02-27 02:57:53'),
(56, 4, 56, '2026-02-27 02:58:24'),
(57, 4, 57, '2026-02-27 02:58:54'),
(58, 4, 58, '2026-02-27 02:59:24'),
(59, 4, 59, '2026-02-27 02:59:54'),
(60, 4, 60, '2026-02-27 03:03:03'),
(61, 4, 61, '2026-02-27 03:03:33'),
(62, 4, 62, '2026-02-27 03:04:03'),
(63, 4, 63, '2026-02-27 03:04:33'),
(64, 4, 64, '2026-02-27 03:05:03'),
(65, 4, 65, '2026-02-27 03:05:33'),
(66, 4, 66, '2026-02-27 03:06:03'),
(67, 4, 67, '2026-02-27 03:06:33'),
(68, 4, 68, '2026-02-27 03:07:03'),
(69, 4, 69, '2026-02-27 03:07:35'),
(70, 4, 70, '2026-02-27 03:08:05'),
(71, 4, 71, '2026-02-27 03:08:35'),
(72, 4, 72, '2026-02-27 03:09:05'),
(73, 4, 73, '2026-02-27 03:09:35'),
(74, 4, 74, '2026-02-27 03:10:34'),
(75, 4, 75, '2026-02-27 03:11:04'),
(76, 4, 76, '2026-02-27 03:11:34'),
(77, 4, 77, '2026-02-27 03:12:04'),
(78, 4, 78, '2026-02-27 03:12:34'),
(79, 4, 79, '2026-02-27 03:13:04');

-- --------------------------------------------------------

--
-- Table structure for table `tblappliance_types`
--

CREATE TABLE `tblappliance_types` (
  `appliance_type_id` int(11) NOT NULL,
  `appliance_type_category_id` int(11) NOT NULL,
  `appliance_type_name` varchar(100) DEFAULT NULL,
  `appliance_type_typical_power_w` decimal(10,2) DEFAULT NULL,
  `appliance_type_power_factor` decimal(5,2) DEFAULT NULL,
  `appliance_type_nominal_frequency_hz` decimal(5,2) DEFAULT 60.00,
  `appliance_type_frequency_tolerance` decimal(5,2) DEFAULT 0.50,
  `appliance_type_thd_reference` decimal(5,2) DEFAULT NULL,
  `appliance_type_harmonic_signature` text DEFAULT NULL,
  `appliance_type_power_pattern` enum('constant','cyclic','variable') DEFAULT 'constant'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblappliance_types`
--

INSERT INTO `tblappliance_types` (`appliance_type_id`, `appliance_type_category_id`, `appliance_type_name`, `appliance_type_typical_power_w`, `appliance_type_power_factor`, `appliance_type_nominal_frequency_hz`, `appliance_type_frequency_tolerance`, `appliance_type_thd_reference`, `appliance_type_harmonic_signature`, `appliance_type_power_pattern`) VALUES
(1, 1, 'Air Conditioner', 1200.00, 0.85, 60.00, 0.50, 12.50, '{\"3rd\":0.12,\"5th\":0.08}', 'cyclic'),
(2, 1, 'Electric Fan', 75.00, 0.90, 60.00, 0.50, 5.00, '{\"3rd\":0.03}', 'constant'),
(3, 2, 'Refrigerator', 150.00, 0.80, 60.00, 0.50, 10.00, '{\"3rd\":0.09,\"5th\":0.05}', 'cyclic'),
(4, 2, 'Rice Cooker', 700.00, 0.99, 60.00, 0.50, 3.00, '{\"3rd\":0.02}', 'variable'),
(5, 3, 'LED TV', 120.00, 0.70, 60.00, 0.50, 18.00, '{\"3rd\":0.15,\"5th\":0.10}', 'constant'),
(6, 5, 'Computer', 200.00, 0.90, 60.00, 0.50, NULL, NULL, 'constant'),
(7, 4, 'Lights', 60.00, 0.90, 60.00, 0.50, NULL, NULL, 'constant');

-- --------------------------------------------------------

--
-- Table structure for table `tblappliance_usage_summary`
--

CREATE TABLE `tblappliance_usage_summary` (
  `summary_id` int(11) NOT NULL,
  `summary_billing_header_id` int(11) DEFAULT NULL,
  `summary_appliance_type_id` int(11) DEFAULT NULL,
  `summary_runtime_hours` decimal(10,2) DEFAULT NULL,
  `summary_energy_kwh` decimal(10,2) DEFAULT NULL,
  `summary_cost` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblappliance_usage_summary`
--

INSERT INTO `tblappliance_usage_summary` (`summary_id`, `summary_billing_header_id`, `summary_appliance_type_id`, `summary_runtime_hours`, `summary_energy_kwh`, `summary_cost`) VALUES
(1, 1, 1, 80.00, 96.00, 1152.00),
(2, 2, 4, 30.00, 21.00, 252.00),
(3, 3, 5, 50.00, 6.00, 72.00);

-- --------------------------------------------------------

--
-- Table structure for table `tblbilling_details`
--

CREATE TABLE `tblbilling_details` (
  `billing_detail_id` int(11) NOT NULL,
  `billing_detail_header_id` int(11) DEFAULT NULL,
  `billing_detail_rate_per_kwh` decimal(10,2) DEFAULT NULL,
  `billing_detail_energy_charge` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblbilling_details`
--

INSERT INTO `tblbilling_details` (`billing_detail_id`, `billing_detail_header_id`, `billing_detail_rate_per_kwh`, `billing_detail_energy_charge`) VALUES
(1, 1, 12.00, 1440.00),
(2, 2, 12.00, 1020.00),
(3, 3, 12.00, 720.00);

-- --------------------------------------------------------

--
-- Table structure for table `tblbilling_headers`
--

CREATE TABLE `tblbilling_headers` (
  `billing_header_id` int(11) NOT NULL,
  `billing_header_room_id` int(11) DEFAULT NULL,
  `billing_header_tenant_id` int(11) DEFAULT NULL,
  `billing_header_month` varchar(7) DEFAULT NULL,
  `billing_header_total_kwh` decimal(10,2) DEFAULT NULL,
  `billing_header_total_amount` decimal(10,2) DEFAULT NULL,
  `billing_header_status` enum('pending','paid') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblbilling_headers`
--

INSERT INTO `tblbilling_headers` (`billing_header_id`, `billing_header_room_id`, `billing_header_tenant_id`, `billing_header_month`, `billing_header_total_kwh`, `billing_header_total_amount`, `billing_header_status`) VALUES
(1, 1, 3, '2026-02', 120.00, 1440.00, 'pending'),
(2, 2, 4, '2026-02', 85.00, 1020.00, 'pending'),
(3, 3, 5, '2026-02', 60.00, 720.00, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `tbldevices`
--

CREATE TABLE `tbldevices` (
  `device_id` int(11) NOT NULL,
  `device_name` varchar(100) DEFAULT NULL,
  `device_identifier` varchar(100) DEFAULT NULL,
  `device_status` enum('online','offline') DEFAULT 'online',
  `device_last_seen` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbldevices`
--

INSERT INTO `tbldevices` (`device_id`, `device_name`, `device_identifier`, `device_status`, `device_last_seen`, `created_at`) VALUES
(1, 'ESP32 Room 101', 'DEV-101', 'online', '2026-02-27 01:44:28', '2026-02-27 01:44:28'),
(2, 'ESP32 Room 102', 'DEV-102', 'online', '2026-02-27 01:44:28', '2026-02-27 01:44:28'),
(3, 'ESP32 Room 103', 'DEV-103', 'online', '2026-02-27 01:44:28', '2026-02-27 01:44:28'),
(4, 'Smart Energy Monitor', 'MOCK-1772130123975', 'online', '2026-02-27 02:22:03', '2026-02-27 02:22:03'),
(5, 'CL1', 'MACTEST', 'online', '2026-02-27 02:24:45', '2026-02-27 02:24:45'),
(6, 'Smart Energy Monitor', 'MOCK-1772131804569', 'online', '2026-02-27 02:50:04', '2026-02-27 02:50:04');

-- --------------------------------------------------------

--
-- Table structure for table `tblreading_details`
--

CREATE TABLE `tblreading_details` (
  `reading_detail_id` int(11) NOT NULL,
  `reading_detail_header_id` int(11) DEFAULT NULL,
  `reading_detail_voltage` decimal(10,2) DEFAULT NULL,
  `reading_detail_current` decimal(10,3) DEFAULT NULL,
  `reading_detail_power_w` decimal(10,2) DEFAULT NULL,
  `reading_detail_frequency` decimal(10,2) DEFAULT NULL,
  `reading_detail_power_factor` decimal(5,2) DEFAULT NULL,
  `reading_detail_thd_percentage` decimal(5,2) DEFAULT NULL,
  `reading_detail_energy_kwh` decimal(10,4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblreading_details`
--

INSERT INTO `tblreading_details` (`reading_detail_id`, `reading_detail_header_id`, `reading_detail_voltage`, `reading_detail_current`, `reading_detail_power_w`, `reading_detail_frequency`, `reading_detail_power_factor`, `reading_detail_thd_percentage`, `reading_detail_energy_kwh`) VALUES
(1, 1, 220.00, 5.200, 1180.00, 60.02, 0.84, 13.00, 1.2500),
(2, 2, 220.00, 3.500, 710.00, 60.01, 0.98, 3.10, 0.8500),
(3, 3, 220.00, 2.100, 120.00, 59.98, 0.72, 17.50, 0.5200),
(4, 4, 223.85, 2.007, 2540.95, 60.01, 0.95, 0.00, 0.0161),
(5, 5, 219.57, 2.403, 2632.24, 60.04, 0.86, 0.00, 0.0379),
(6, 6, 224.27, 2.472, 2434.39, 59.91, 0.89, 0.00, 0.0589),
(7, 7, 218.68, 1.965, 2634.03, 60.01, 0.91, 0.00, 0.0804),
(8, 8, 223.94, 2.306, 2332.87, 60.04, 0.89, 0.00, 0.1008),
(9, 9, 223.61, 2.119, 46.36, 60.03, 0.94, 0.00, 0.0000),
(10, 10, 216.40, 2.202, 40.76, 59.96, 0.86, 0.00, 0.0000),
(11, 11, 219.95, 2.465, 1177.35, 59.96, 0.94, 0.00, 0.0062),
(12, 12, 223.57, 1.939, 1310.09, 60.10, 0.85, 0.00, 0.0167),
(13, 13, 218.62, 2.034, 1186.65, 60.05, 0.88, 0.00, 0.0276),
(14, 14, 219.96, 2.486, 1243.00, 60.09, 0.88, 0.00, 0.0377),
(15, 15, 220.16, 2.565, 1086.97, 59.97, 0.88, 0.00, 0.0474),
(16, 16, 218.54, 2.504, 1078.74, 60.06, 0.92, 0.00, 0.0566),
(17, 17, 218.72, 2.193, 1113.06, 60.04, 0.88, 0.00, 0.0655),
(18, 18, 217.27, 2.323, 1067.18, 60.03, 0.87, 0.00, 0.0746),
(19, 19, 217.20, 2.249, 1142.46, 59.93, 0.89, 0.00, 0.0838),
(20, 20, 220.66, 2.282, 1429.87, 60.00, 0.87, 0.00, 0.0117),
(21, 21, 216.09, 2.632, 1013.95, 59.98, 0.85, 0.00, 0.0929),
(22, 22, 221.29, 2.234, 1043.44, 60.02, 0.89, 0.00, 0.1018),
(23, 23, 220.24, 2.226, 1152.52, 59.91, 0.92, 0.00, 0.0104),
(24, 24, 215.52, 2.108, 1023.34, 59.98, 0.92, 0.00, 0.1107),
(25, 25, 216.94, 2.580, 1197.92, 59.90, 0.86, 0.00, 0.0205),
(26, 26, 222.11, 2.368, 867.98, 60.01, 0.89, 0.00, 0.1186),
(27, 27, 216.22, 2.150, 1354.61, 59.91, 0.90, 0.00, 0.0310),
(28, 28, 224.12, 1.937, 927.54, 60.09, 0.90, 0.00, 0.1262),
(29, 29, 220.95, 2.491, 1334.76, 59.90, 0.87, 0.00, 0.0420),
(30, 30, 220.19, 2.380, 1261.31, 59.94, 0.91, 0.00, 0.0106),
(31, 31, 218.26, 2.031, 1191.13, 60.08, 0.91, 0.00, 0.0109),
(32, 32, 223.28, 2.399, 1612.65, 60.01, 0.94, 0.00, 0.0120),
(33, 33, 223.13, 2.039, 1399.02, 60.03, 0.87, 0.00, 0.0113),
(34, 34, 224.68, 1.916, 1456.41, 60.04, 0.88, 0.00, 0.0235),
(35, 35, 224.83, 2.219, 1413.54, 60.01, 0.95, 0.00, 0.0239),
(36, 36, 220.55, 2.551, 1652.07, 59.99, 0.89, 0.00, 0.0364),
(37, 37, 220.55, 2.168, 1939.02, 60.00, 0.90, 0.00, 0.0518),
(38, 38, 221.57, 2.298, -15.00, 60.07, 0.90, 0.00, 0.0579),
(39, 39, 224.07, 1.946, 1426.48, 59.92, 0.87, 0.00, 0.0116),
(40, 40, 223.04, 2.502, 1262.43, 60.08, 0.86, 0.00, 0.0076),
(41, 41, 222.24, 2.360, 1351.43, 59.98, 0.89, 0.00, 0.0190),
(42, 42, 217.69, 2.237, 1163.63, 60.03, 0.88, 0.00, 0.0294),
(43, 43, 218.40, 2.256, 1582.67, 59.95, 0.93, 0.00, 0.0240),
(44, 44, 223.76, 2.037, 1173.10, 59.95, 0.94, 0.00, 0.0397),
(45, 45, 221.87, 2.296, 1469.47, 59.96, 0.90, 0.00, 0.0114),
(46, 46, 217.21, 2.356, 1320.20, 60.06, 0.91, 0.00, 0.0111),
(47, 47, 216.84, 2.345, 1518.03, 59.99, 0.91, 0.00, 0.0228),
(48, 48, 224.41, 2.054, 1358.08, 59.94, 0.86, 0.00, 0.0234),
(49, 49, 216.03, 2.090, 1248.33, 60.08, 0.95, 0.00, 0.0109),
(50, 50, 218.38, 2.130, 1283.80, 60.01, 0.94, 0.00, 0.0220),
(51, 51, 221.59, 2.531, 1443.11, 59.99, 0.94, 0.00, 0.0340),
(52, 52, 215.11, 2.635, 1649.89, 60.03, 0.87, 0.00, 0.0467),
(53, 53, 224.44, 2.531, 1626.17, 60.05, 0.95, 0.00, 0.0606),
(54, 54, 224.98, 2.281, 1557.44, 60.07, 0.89, 0.00, 0.0740),
(55, 55, 218.07, 2.274, 1638.29, 59.93, 0.87, 0.00, 0.0876),
(56, 56, 216.53, 2.539, 1632.31, 59.99, 0.94, 0.00, 0.1017),
(57, 57, 224.10, 2.547, 1612.75, 60.00, 0.92, 0.00, 0.1155),
(58, 58, 224.56, 2.480, 1623.02, 59.94, 0.92, 0.00, 0.1286),
(59, 59, 224.18, 2.023, 1551.57, 60.01, 0.88, 0.00, 0.1418),
(60, 60, 217.97, 2.603, 1264.12, 60.08, 0.89, 0.00, 0.0107),
(61, 61, 220.94, 2.562, 1230.23, 59.98, 0.91, 0.00, 0.0209),
(62, 62, 223.32, 2.039, 1460.75, 59.94, 0.95, 0.00, 0.0320),
(63, 63, 217.80, 2.182, 1371.20, 60.08, 0.95, 0.00, 0.0435),
(64, 64, 219.34, 2.321, 1207.09, 59.92, 0.90, 0.00, 0.0549),
(65, 65, 217.83, 1.981, 1174.98, 59.97, 0.88, 0.00, 0.0644),
(66, 66, 215.94, 2.594, 1102.45, 59.93, 0.85, 0.00, 0.0744),
(67, 67, 217.90, 2.316, 1205.49, 60.08, 0.89, 0.00, 0.0842),
(68, 68, 220.17, 1.994, 1266.66, 59.97, 0.89, 0.00, 0.0945),
(69, 69, 219.23, 2.521, 1301.24, 60.06, 0.88, 0.00, 0.1053),
(70, 70, 224.73, 1.909, 1380.46, 59.96, 0.94, 0.00, 0.1167),
(71, 71, 219.07, 2.428, 1537.79, 60.05, 0.93, 0.00, 0.1291),
(72, 72, 219.09, 2.296, 1802.06, 60.09, 0.90, 0.00, 0.1429),
(73, 73, 220.96, 2.120, 1853.82, 59.99, 0.87, 0.00, 0.1587),
(74, 74, 223.55, 2.151, 1233.75, 59.93, 0.87, 0.00, 0.0109),
(75, 75, 223.95, 2.360, 1158.86, 60.02, 0.85, 0.00, 0.0211),
(76, 76, 215.40, 2.426, 1069.73, 60.07, 0.89, 0.00, 0.0301),
(77, 77, 220.74, 2.540, 1062.08, 60.06, 0.85, 0.00, 0.0387),
(78, 78, 217.18, 2.386, 1009.64, 60.02, 0.86, 0.00, 0.0477),
(79, 79, 216.80, 1.984, 989.69, 60.04, 0.89, 0.00, 0.0562);

-- --------------------------------------------------------

--
-- Table structure for table `tblreading_headers`
--

CREATE TABLE `tblreading_headers` (
  `reading_header_id` int(11) NOT NULL,
  `reading_header_room_id` int(11) DEFAULT NULL,
  `reading_header_device_id` int(11) DEFAULT NULL,
  `reading_header_time` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblreading_headers`
--

INSERT INTO `tblreading_headers` (`reading_header_id`, `reading_header_room_id`, `reading_header_device_id`, `reading_header_time`) VALUES
(1, 1, 1, '2026-02-27 01:44:28'),
(2, 2, 2, '2026-02-27 01:44:28'),
(3, 3, 3, '2026-02-27 01:44:28'),
(4, 4, 4, '2026-02-27 02:22:33'),
(5, 4, 4, '2026-02-27 02:23:03'),
(6, 4, 4, '2026-02-27 02:23:33'),
(7, 4, 4, '2026-02-27 02:24:03'),
(8, 4, 4, '2026-02-27 02:24:33'),
(9, 4, 5, '2026-02-27 02:29:03'),
(10, 4, 5, '2026-02-27 02:29:33'),
(11, 4, 5, '2026-02-27 02:30:18'),
(12, 4, 5, '2026-02-27 02:30:48'),
(13, 4, 5, '2026-02-27 02:31:18'),
(14, 4, 5, '2026-02-27 02:40:24'),
(15, 4, 5, '2026-02-27 02:40:54'),
(16, 4, 5, '2026-02-27 02:41:24'),
(17, 4, 5, '2026-02-27 02:41:54'),
(18, 4, 5, '2026-02-27 02:42:24'),
(19, 4, 5, '2026-02-27 02:42:54'),
(20, 4, 5, '2026-02-27 02:43:20'),
(21, 4, 5, '2026-02-27 02:43:24'),
(22, 4, 5, '2026-02-27 02:43:54'),
(23, 4, 5, '2026-02-27 02:44:17'),
(24, 4, 5, '2026-02-27 02:44:24'),
(25, 4, 5, '2026-02-27 02:44:47'),
(26, 4, 5, '2026-02-27 02:44:54'),
(27, 4, 5, '2026-02-27 02:45:18'),
(28, 4, 5, '2026-02-27 02:45:24'),
(29, 4, 5, '2026-02-27 02:45:51'),
(30, 4, 5, '2026-02-27 02:46:27'),
(31, 4, 5, '2026-02-27 02:46:40'),
(32, 4, 5, '2026-02-27 02:47:27'),
(33, 4, 5, '2026-02-27 02:47:35'),
(34, 4, 5, '2026-02-27 02:48:05'),
(35, 4, 5, '2026-02-27 02:48:35'),
(36, 4, 5, '2026-02-27 02:48:40'),
(37, 4, 5, '2026-02-27 02:49:10'),
(38, 5, 6, '2026-02-27 02:50:21'),
(39, 4, 5, '2026-02-27 02:51:12'),
(40, 4, 5, '2026-02-27 02:51:30'),
(41, 4, 5, '2026-02-27 02:52:00'),
(42, 4, 5, '2026-02-27 02:52:30'),
(43, 4, 5, '2026-02-27 02:52:35'),
(44, 4, 5, '2026-02-27 02:53:00'),
(45, 4, 5, '2026-02-27 02:53:33'),
(46, 4, 5, '2026-02-27 02:53:37'),
(47, 4, 5, '2026-02-27 02:54:07'),
(48, 4, 5, '2026-02-27 02:54:12'),
(49, 4, 5, '2026-02-27 02:54:53'),
(50, 4, 5, '2026-02-27 02:55:23'),
(51, 4, 5, '2026-02-27 02:55:53'),
(52, 4, 5, '2026-02-27 02:56:23'),
(53, 4, 5, '2026-02-27 02:56:53'),
(54, 4, 5, '2026-02-27 02:57:23'),
(55, 4, 5, '2026-02-27 02:57:53'),
(56, 4, 5, '2026-02-27 02:58:24'),
(57, 4, 5, '2026-02-27 02:58:54'),
(58, 4, 5, '2026-02-27 02:59:24'),
(59, 4, 5, '2026-02-27 02:59:54'),
(60, 4, 5, '2026-02-27 03:03:03'),
(61, 4, 5, '2026-02-27 03:03:33'),
(62, 4, 5, '2026-02-27 03:04:03'),
(63, 4, 5, '2026-02-27 03:04:33'),
(64, 4, 5, '2026-02-27 03:05:03'),
(65, 4, 5, '2026-02-27 03:05:33'),
(66, 4, 5, '2026-02-27 03:06:03'),
(67, 4, 5, '2026-02-27 03:06:33'),
(68, 4, 5, '2026-02-27 03:07:03'),
(69, 4, 5, '2026-02-27 03:07:35'),
(70, 4, 5, '2026-02-27 03:08:05'),
(71, 4, 5, '2026-02-27 03:08:35'),
(72, 4, 5, '2026-02-27 03:09:05'),
(73, 4, 5, '2026-02-27 03:09:35'),
(74, 4, 5, '2026-02-27 03:10:34'),
(75, 4, 5, '2026-02-27 03:11:04'),
(76, 4, 5, '2026-02-27 03:11:34'),
(77, 4, 5, '2026-02-27 03:12:04'),
(78, 4, 5, '2026-02-27 03:12:34'),
(79, 4, 5, '2026-02-27 03:13:04');

-- --------------------------------------------------------

--
-- Table structure for table `tblrelay_control_logs`
--

CREATE TABLE `tblrelay_control_logs` (
  `log_id` int(11) NOT NULL,
  `relay_control_log_room_id` int(11) DEFAULT NULL,
  `relay_control_log_command` enum('ON','OFF') DEFAULT NULL,
  `executed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblrelay_control_logs`
--

INSERT INTO `tblrelay_control_logs` (`log_id`, `relay_control_log_room_id`, `relay_control_log_command`, `executed_at`) VALUES
(1, 1, 'OFF', '2026-02-27 01:44:29'),
(2, 2, 'ON', '2026-02-27 01:44:29');

-- --------------------------------------------------------

--
-- Table structure for table `tblroles`
--

CREATE TABLE `tblroles` (
  `role_id` int(11) NOT NULL,
  `role_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblroles`
--

INSERT INTO `tblroles` (`role_id`, `role_name`) VALUES
(1, 'admin'),
(2, 'landlord'),
(3, 'tenant');

-- --------------------------------------------------------

--
-- Table structure for table `tblrooms`
--

CREATE TABLE `tblrooms` (
  `room_id` int(11) NOT NULL,
  `room_name` varchar(100) DEFAULT NULL,
  `room_tenant_id` int(11) DEFAULT NULL,
  `room_device_id` int(11) DEFAULT NULL,
  `room_rate_per_kwh` decimal(10,2) DEFAULT 12.00,
  `room_status` enum('available','occupied') DEFAULT 'occupied'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblrooms`
--

INSERT INTO `tblrooms` (`room_id`, `room_name`, `room_tenant_id`, `room_device_id`, `room_rate_per_kwh`, `room_status`) VALUES
(1, 'Room 101', 3, 1, 12.00, 'occupied'),
(2, 'Room 102', 4, 2, 12.00, 'occupied'),
(3, 'Room 103', 5, 3, 12.00, 'occupied'),
(4, 'Room 4', 6, 5, 12.00, 'occupied'),
(5, 'Room 6', 7, 6, 12.00, 'occupied');

-- --------------------------------------------------------

--
-- Table structure for table `tblsystem_logs`
--

CREATE TABLE `tblsystem_logs` (
  `log_id` int(11) NOT NULL,
  `system_log_user_id` int(11) DEFAULT NULL,
  `system_log_action` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblsystem_logs`
--

INSERT INTO `tblsystem_logs` (`log_id`, `system_log_user_id`, `system_log_action`, `created_at`) VALUES
(1, 1, 'Generated February Billing', '2026-02-27 01:44:29'),
(2, 2, 'Updated Appliance Signatures', '2026-02-27 01:44:29');

-- --------------------------------------------------------

--
-- Table structure for table `tblsystem_settings`
--

CREATE TABLE `tblsystem_settings` (
  `setting_id` int(11) NOT NULL,
  `setting_key` varchar(100) NOT NULL,
  `setting_value` text DEFAULT NULL,
  `setting_description` varchar(255) DEFAULT NULL,
  `setting_category` enum('billing','detection','alerts','general') DEFAULT 'general',
  `setting_updated_by` int(11) DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblsystem_settings`
--

INSERT INTO `tblsystem_settings` (`setting_id`, `setting_key`, `setting_value`, `setting_description`, `setting_category`, `setting_updated_by`, `updated_at`) VALUES
(1, 'default_rate_per_kwh', '12.00', 'Default electricity rate per kWh', 'billing', 1, '2026-02-27 01:44:29'),
(2, 'billing_cycle_day', '1', 'Day of month when billing cycle starts', 'billing', 1, '2026-02-27 01:44:29'),
(3, 'currency', 'PHP', 'System currency', 'billing', 1, '2026-02-27 01:44:29'),
(4, 'high_power_threshold', '2000', 'Alert threshold for high power consumption (watts)', 'alerts', 1, '2026-02-27 01:44:29'),
(5, 'high_thd_threshold', '20.0', 'Alert threshold for high THD percentage', 'alerts', 1, '2026-02-27 01:44:29'),
(6, 'detection_confidence_min', '0.75', 'Minimum confidence score for appliance detection', 'detection', 1, '2026-02-27 01:44:29'),
(7, 'frequency_nominal', '60.00', 'Nominal frequency in Hz', 'detection', 1, '2026-02-27 01:44:29'),
(8, 'frequency_tolerance', '0.50', 'Acceptable frequency deviation in Hz', 'detection', 1, '2026-02-27 01:44:29'),
(9, 'system_name', 'NILM Capstone System', 'System display name', 'general', 1, '2026-02-27 01:44:29'),
(10, 'timezone', 'Asia/Manila', 'System timezone', 'general', 1, '2026-02-27 01:44:29'),
(11, 'maintenance_mode', 'false', 'Enable/disable maintenance mode', 'general', 1, '2026-02-27 01:44:29'),
(12, 'auto_billing_enabled', 'true', 'Enable automatic monthly billing generation', 'billing', 1, '2026-02-27 01:44:29'),
(13, 'alert_email_enabled', 'true', 'Enable email notifications for alerts', 'alerts', 1, '2026-02-27 01:44:29');

-- --------------------------------------------------------

--
-- Table structure for table `tblusers`
--

CREATE TABLE `tblusers` (
  `user_id` int(11) NOT NULL,
  `user_role_id` int(11) NOT NULL,
  `user_status_id` int(11) NOT NULL,
  `user_name` varchar(100) NOT NULL,
  `user_email` varchar(100) NOT NULL,
  `user_password` varchar(255) NOT NULL,
  `user_phone` varchar(20) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tblusers`
--

INSERT INTO `tblusers` (`user_id`, `user_role_id`, `user_status_id`, `user_name`, `user_email`, `user_password`, `user_phone`, `created_at`) VALUES
(1, 1, 1, 'System Admin', 'admin@nilm.com', 'hashedpass', '09170000001', '2026-02-27 01:44:28'),
(2, 2, 1, 'Mr. Santos', 'landlord@nilm.com', 'hashedpass', '09170000002', '2026-02-27 01:44:28'),
(3, 3, 1, 'Juan Dela Cruz', 'juan@email.com', 'hashedpass', '09170000003', '2026-02-27 01:44:28'),
(4, 3, 1, 'Maria Lopez', 'maria@email.com', 'hashedpass', '09170000004', '2026-02-27 01:44:28'),
(5, 3, 1, 'Kevin Ramos', 'kevin@email.com', 'hashedpass', '09170000005', '2026-02-27 01:44:28'),
(6, 1, 1, 'Neil Emborgo', 'neiljoebertemborgo7@gmail.com', '$2a$10$YRlW82x90bcTLxFuZnRFc.G3VINqzaxMjcpVFHRuiHvrHDTEOs6He', '+639262353430', '2026-02-27 02:22:03'),
(7, 3, 1, 'Romeo Pabellan', 'romeo@gmail.com', '$2a$10$MIaq/KdBzezetuRxMkMGn.ANyBJ5ohfjYhbCc5etG2mapPtYFDQcm', NULL, '2026-02-27 02:50:04');

-- --------------------------------------------------------

--
-- Table structure for table `tbluser_status`
--

CREATE TABLE `tbluser_status` (
  `status_id` int(11) NOT NULL,
  `status_name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tbluser_status`
--

INSERT INTO `tbluser_status` (`status_id`, `status_name`) VALUES
(1, 'active'),
(2, 'inactive'),
(3, 'suspended');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tblalerts`
--
ALTER TABLE `tblalerts`
  ADD PRIMARY KEY (`alert_id`),
  ADD KEY `alert_room_id` (`alert_room_id`);

--
-- Indexes for table `tblappliances`
--
ALTER TABLE `tblappliances`
  ADD PRIMARY KEY (`appliance_id`),
  ADD KEY `appliance_type_id` (`appliance_type_id`),
  ADD KEY `idx_tblappliances_device_id` (`appliance_device_id`),
  ADD KEY `idx_tblappliances_user_id` (`appliance_user_id`);

--
-- Indexes for table `tblappliance_categories`
--
ALTER TABLE `tblappliance_categories`
  ADD PRIMARY KEY (`category_id`),
  ADD UNIQUE KEY `category_name` (`category_name`);

--
-- Indexes for table `tblappliance_detection_details`
--
ALTER TABLE `tblappliance_detection_details`
  ADD PRIMARY KEY (`detection_detail_id`),
  ADD KEY `detection_detail_header_id` (`detection_detail_header_id`),
  ADD KEY `detection_detail_appliance_type_id` (`detection_detail_appliance_type_id`);

--
-- Indexes for table `tblappliance_detection_headers`
--
ALTER TABLE `tblappliance_detection_headers`
  ADD PRIMARY KEY (`detection_header_id`),
  ADD KEY `detection_header_room_id` (`detection_header_room_id`),
  ADD KEY `detection_header_reading_header_id` (`detection_header_reading_header_id`);

--
-- Indexes for table `tblappliance_types`
--
ALTER TABLE `tblappliance_types`
  ADD PRIMARY KEY (`appliance_type_id`),
  ADD KEY `appliance_type_category_id` (`appliance_type_category_id`);

--
-- Indexes for table `tblappliance_usage_summary`
--
ALTER TABLE `tblappliance_usage_summary`
  ADD PRIMARY KEY (`summary_id`),
  ADD KEY `summary_billing_header_id` (`summary_billing_header_id`),
  ADD KEY `summary_appliance_type_id` (`summary_appliance_type_id`);

--
-- Indexes for table `tblbilling_details`
--
ALTER TABLE `tblbilling_details`
  ADD PRIMARY KEY (`billing_detail_id`),
  ADD KEY `billing_detail_header_id` (`billing_detail_header_id`);

--
-- Indexes for table `tblbilling_headers`
--
ALTER TABLE `tblbilling_headers`
  ADD PRIMARY KEY (`billing_header_id`),
  ADD KEY `billing_header_room_id` (`billing_header_room_id`),
  ADD KEY `billing_header_tenant_id` (`billing_header_tenant_id`);

--
-- Indexes for table `tbldevices`
--
ALTER TABLE `tbldevices`
  ADD PRIMARY KEY (`device_id`),
  ADD UNIQUE KEY `device_identifier` (`device_identifier`);

--
-- Indexes for table `tblreading_details`
--
ALTER TABLE `tblreading_details`
  ADD PRIMARY KEY (`reading_detail_id`),
  ADD KEY `reading_detail_header_id` (`reading_detail_header_id`);

--
-- Indexes for table `tblreading_headers`
--
ALTER TABLE `tblreading_headers`
  ADD PRIMARY KEY (`reading_header_id`),
  ADD KEY `reading_header_room_id` (`reading_header_room_id`),
  ADD KEY `reading_header_device_id` (`reading_header_device_id`);

--
-- Indexes for table `tblrelay_control_logs`
--
ALTER TABLE `tblrelay_control_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `relay_control_log_room_id` (`relay_control_log_room_id`);

--
-- Indexes for table `tblroles`
--
ALTER TABLE `tblroles`
  ADD PRIMARY KEY (`role_id`),
  ADD UNIQUE KEY `role_name` (`role_name`);

--
-- Indexes for table `tblrooms`
--
ALTER TABLE `tblrooms`
  ADD PRIMARY KEY (`room_id`),
  ADD KEY `room_tenant_id` (`room_tenant_id`),
  ADD KEY `room_device_id` (`room_device_id`);

--
-- Indexes for table `tblsystem_logs`
--
ALTER TABLE `tblsystem_logs`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `system_log_user_id` (`system_log_user_id`);

--
-- Indexes for table `tblsystem_settings`
--
ALTER TABLE `tblsystem_settings`
  ADD PRIMARY KEY (`setting_id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`),
  ADD KEY `setting_updated_by` (`setting_updated_by`);

--
-- Indexes for table `tblusers`
--
ALTER TABLE `tblusers`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email` (`user_email`),
  ADD KEY `user_role_id` (`user_role_id`),
  ADD KEY `user_status_id` (`user_status_id`);

--
-- Indexes for table `tbluser_status`
--
ALTER TABLE `tbluser_status`
  ADD PRIMARY KEY (`status_id`),
  ADD UNIQUE KEY `status_name` (`status_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tblalerts`
--
ALTER TABLE `tblalerts`
  MODIFY `alert_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tblappliances`
--
ALTER TABLE `tblappliances`
  MODIFY `appliance_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `tblappliance_categories`
--
ALTER TABLE `tblappliance_categories`
  MODIFY `category_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tblappliance_detection_details`
--
ALTER TABLE `tblappliance_detection_details`
  MODIFY `detection_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=157;

--
-- AUTO_INCREMENT for table `tblappliance_detection_headers`
--
ALTER TABLE `tblappliance_detection_headers`
  MODIFY `detection_header_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `tblappliance_types`
--
ALTER TABLE `tblappliance_types`
  MODIFY `appliance_type_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tblappliance_usage_summary`
--
ALTER TABLE `tblappliance_usage_summary`
  MODIFY `summary_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblbilling_details`
--
ALTER TABLE `tblbilling_details`
  MODIFY `billing_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblbilling_headers`
--
ALTER TABLE `tblbilling_headers`
  MODIFY `billing_header_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tbldevices`
--
ALTER TABLE `tbldevices`
  MODIFY `device_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tblreading_details`
--
ALTER TABLE `tblreading_details`
  MODIFY `reading_detail_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `tblreading_headers`
--
ALTER TABLE `tblreading_headers`
  MODIFY `reading_header_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=80;

--
-- AUTO_INCREMENT for table `tblrelay_control_logs`
--
ALTER TABLE `tblrelay_control_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tblroles`
--
ALTER TABLE `tblroles`
  MODIFY `role_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `tblrooms`
--
ALTER TABLE `tblrooms`
  MODIFY `room_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `tblsystem_logs`
--
ALTER TABLE `tblsystem_logs`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `tblsystem_settings`
--
ALTER TABLE `tblsystem_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `tblusers`
--
ALTER TABLE `tblusers`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `tbluser_status`
--
ALTER TABLE `tbluser_status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tblalerts`
--
ALTER TABLE `tblalerts`
  ADD CONSTRAINT `tblalerts_ibfk_1` FOREIGN KEY (`alert_room_id`) REFERENCES `tblrooms` (`room_id`);

--
-- Constraints for table `tblappliances`
--
ALTER TABLE `tblappliances`
  ADD CONSTRAINT `tblappliances_ibfk_1` FOREIGN KEY (`appliance_user_id`) REFERENCES `tblusers` (`user_id`),
  ADD CONSTRAINT `tblappliances_ibfk_2` FOREIGN KEY (`appliance_device_id`) REFERENCES `tbldevices` (`device_id`),
  ADD CONSTRAINT `tblappliances_ibfk_3` FOREIGN KEY (`appliance_type_id`) REFERENCES `tblappliance_types` (`appliance_type_id`);

--
-- Constraints for table `tblappliance_detection_details`
--
ALTER TABLE `tblappliance_detection_details`
  ADD CONSTRAINT `tblappliance_detection_details_ibfk_1` FOREIGN KEY (`detection_detail_header_id`) REFERENCES `tblappliance_detection_headers` (`detection_header_id`),
  ADD CONSTRAINT `tblappliance_detection_details_ibfk_2` FOREIGN KEY (`detection_detail_appliance_type_id`) REFERENCES `tblappliance_types` (`appliance_type_id`);

--
-- Constraints for table `tblappliance_detection_headers`
--
ALTER TABLE `tblappliance_detection_headers`
  ADD CONSTRAINT `tblappliance_detection_headers_ibfk_1` FOREIGN KEY (`detection_header_room_id`) REFERENCES `tblrooms` (`room_id`),
  ADD CONSTRAINT `tblappliance_detection_headers_ibfk_2` FOREIGN KEY (`detection_header_reading_header_id`) REFERENCES `tblreading_headers` (`reading_header_id`);

--
-- Constraints for table `tblappliance_types`
--
ALTER TABLE `tblappliance_types`
  ADD CONSTRAINT `tblappliance_types_ibfk_1` FOREIGN KEY (`appliance_type_category_id`) REFERENCES `tblappliance_categories` (`category_id`);

--
-- Constraints for table `tblappliance_usage_summary`
--
ALTER TABLE `tblappliance_usage_summary`
  ADD CONSTRAINT `tblappliance_usage_summary_ibfk_1` FOREIGN KEY (`summary_billing_header_id`) REFERENCES `tblbilling_headers` (`billing_header_id`),
  ADD CONSTRAINT `tblappliance_usage_summary_ibfk_2` FOREIGN KEY (`summary_appliance_type_id`) REFERENCES `tblappliance_types` (`appliance_type_id`);

--
-- Constraints for table `tblbilling_details`
--
ALTER TABLE `tblbilling_details`
  ADD CONSTRAINT `tblbilling_details_ibfk_1` FOREIGN KEY (`billing_detail_header_id`) REFERENCES `tblbilling_headers` (`billing_header_id`);

--
-- Constraints for table `tblbilling_headers`
--
ALTER TABLE `tblbilling_headers`
  ADD CONSTRAINT `tblbilling_headers_ibfk_1` FOREIGN KEY (`billing_header_room_id`) REFERENCES `tblrooms` (`room_id`),
  ADD CONSTRAINT `tblbilling_headers_ibfk_2` FOREIGN KEY (`billing_header_tenant_id`) REFERENCES `tblusers` (`user_id`);

--
-- Constraints for table `tblreading_details`
--
ALTER TABLE `tblreading_details`
  ADD CONSTRAINT `tblreading_details_ibfk_1` FOREIGN KEY (`reading_detail_header_id`) REFERENCES `tblreading_headers` (`reading_header_id`);

--
-- Constraints for table `tblreading_headers`
--
ALTER TABLE `tblreading_headers`
  ADD CONSTRAINT `tblreading_headers_ibfk_1` FOREIGN KEY (`reading_header_room_id`) REFERENCES `tblrooms` (`room_id`),
  ADD CONSTRAINT `tblreading_headers_ibfk_2` FOREIGN KEY (`reading_header_device_id`) REFERENCES `tbldevices` (`device_id`);

--
-- Constraints for table `tblrelay_control_logs`
--
ALTER TABLE `tblrelay_control_logs`
  ADD CONSTRAINT `tblrelay_control_logs_ibfk_1` FOREIGN KEY (`relay_control_log_room_id`) REFERENCES `tblrooms` (`room_id`);

--
-- Constraints for table `tblrooms`
--
ALTER TABLE `tblrooms`
  ADD CONSTRAINT `tblrooms_ibfk_1` FOREIGN KEY (`room_tenant_id`) REFERENCES `tblusers` (`user_id`),
  ADD CONSTRAINT `tblrooms_ibfk_2` FOREIGN KEY (`room_device_id`) REFERENCES `tbldevices` (`device_id`);

--
-- Constraints for table `tblsystem_logs`
--
ALTER TABLE `tblsystem_logs`
  ADD CONSTRAINT `tblsystem_logs_ibfk_1` FOREIGN KEY (`system_log_user_id`) REFERENCES `tblusers` (`user_id`);

--
-- Constraints for table `tblsystem_settings`
--
ALTER TABLE `tblsystem_settings`
  ADD CONSTRAINT `tblsystem_settings_ibfk_1` FOREIGN KEY (`setting_updated_by`) REFERENCES `tblusers` (`user_id`);

--
-- Constraints for table `tblusers`
--
ALTER TABLE `tblusers`
  ADD CONSTRAINT `tblusers_ibfk_1` FOREIGN KEY (`user_role_id`) REFERENCES `tblroles` (`role_id`),
  ADD CONSTRAINT `tblusers_ibfk_2` FOREIGN KEY (`user_status_id`) REFERENCES `tbluser_status` (`status_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
