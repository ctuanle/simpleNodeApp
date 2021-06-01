-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jun 01, 2021 at 02:15 AM
-- Server version: 10.5.4-MariaDB
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `productshop`
--

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `price` decimal(5,0) NOT NULL,
  `category` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `images` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=81 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `price`, `category`, `images`) VALUES
(64, 'MyBook1', '19', 'book', 'images\\1622487793714-book.jpg'),
(65, 'MyPhone1', '299', 'phone', 'images\\1622487801023-phone.jpeg'),
(66, 'MyLaptop1', '799', 'laptop', 'images\\1622487808174-laptop.jpg'),
(67, 'MyPhone2', '299', 'phone', 'images\\1622487814827-phone.jpeg'),
(72, 'ALaptop1', '999', 'laptop', 'images\\1622487823160-laptop.jpg'),
(73, 'Hello', '18', 'book', 'images\\1622491513913-book.jpg'),
(74, 'World', '79', 'phone', 'images\\1622491530159-phone.jpeg'),
(75, 'Welcome', '599', 'laptop', 'images\\1622491557974-laptop.jpg'),
(76, 'To', '6', 'book', 'images\\1622491574991-book.jpg'),
(77, 'Our', '359', 'phone', 'images\\1622491595664-phone.jpeg'),
(78, 'Shop', '677', 'laptop', 'images\\1622491611627-laptop.jpg'),
(79, 'Happy', '19', 'book', 'images\\1622491688429-book.jpg'),
(80, 'Shopping', '199', 'phone', 'images\\1622491703102-phone.jpeg');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `uid` int(5) NOT NULL AUTO_INCREMENT,
  `username` varchar(25) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `username`, `password`, `email`) VALUES
(13, 'cole', '$2b$10$1q18TPTHdmsYjrWhfu1Ue.BvtSP2Qmwz9e/A0g8QbwAa4X0zfQ0hG', 'cole@node.io'),
(14, 'azezrra', '$2b$10$EimYfB0/9R5Hs.n01ihL3uie.BLGAPaR8T6SkTdOYwHXDOIkrsXgq', '');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
