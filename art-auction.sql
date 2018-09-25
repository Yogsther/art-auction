-- phpMyAdmin SQL Dump
-- version 4.8.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 25, 2018 at 11:42 PM
-- Server version: 10.1.35-MariaDB
-- PHP Version: 7.2.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `art-auction`
--

-- --------------------------------------------------------

--
-- Table structure for table `paintings`
--

CREATE TABLE `paintings` (
  `title` varchar(100) NOT NULL,
  `id` int(11) NOT NULL,
  `owner_id` int(11) NOT NULL,
  `history` text NOT NULL,
  `data` longtext NOT NULL,
  `on_sale` tinyint(1) NOT NULL DEFAULT '0',
  `sale_price` int(50) NOT NULL,
  `views` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `signatures`
--

CREATE TABLE `signatures` (
  `owner_id` int(11) NOT NULL,
  `data` longtext NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `username` varchar(20) NOT NULL,
  `password` varchar(128) NOT NULL,
  `id` int(11) NOT NULL,
  `wallet` bigint(20) NOT NULL DEFAULT '0',
  `last_claimed` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`username`, `password`, `id`, `wallet`, `last_claimed`) VALUES
('Yogsther', '3d9e42465532ba1d45ac5552031745e0', 4, 0, ''),
('asd', 'edc7eec1d69636c914b766358e394800', 7, 0, ''),
('Testlmao', '8c4236b38cc28dbd6d3179c5ce84ec80', 9, 0, ''),
('ayylmao', '0f7d9ce83159737e0f5ed5305d27837f', 22, 0, ''),
('ssssssssssssssssssss', '6fe1dd8d2299a3e6c3bc352471fb71d3', 23, 0, ''),
('big_boi', '4325f022ab083d0e5991c94c9f0eee3a', 24, 0, ''),
('Biballs', '6ad42c46cd6a21f3c92301db8e3d5e08', 31, 0, ''),
('Olle', 'cbc8151b4cd63448bf0eec32112d0174', 32, 10, ''),
('Test_account', 'fb27b62e7e4b73a59f259acb27b950af', 33, 10, '');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `paintings`
--
ALTER TABLE `paintings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `paintings`
--
ALTER TABLE `paintings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
