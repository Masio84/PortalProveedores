-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-04-2026 a las 02:28:22
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `portal_gestion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL COMMENT 'Referencia a usuarios.id',
  `tipo_proveedor` enum('fisica_empresarial','moral','general') NOT NULL COMMENT 'Tipo de registro',
  `rfc` varchar(13) NOT NULL,
  `razon_social` varchar(255) NOT NULL,
  `regimen_fiscal` varchar(100) NOT NULL,
  `nombre_vialidad` varchar(150) DEFAULT NULL,
  `num_exterior` varchar(20) DEFAULT NULL,
  `num_interior` varchar(20) DEFAULT NULL,
  `colonia` varchar(100) DEFAULT NULL,
  `localidad` varchar(100) DEFAULT NULL,
  `codigo_postal` varchar(10) DEFAULT NULL,
  `ciudad` varchar(100) DEFAULT NULL,
  `estado` varchar(100) DEFAULT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `extension` varchar(10) DEFAULT NULL,
  `fax` varchar(20) DEFAULT NULL,
  `fax_extension` varchar(10) DEFAULT NULL,
  `representante_legal` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `banco` varchar(100) DEFAULT NULL,
  `sucursal_bancaria` varchar(100) DEFAULT NULL,
  `cuenta_bancaria` varchar(50) DEFAULT NULL,
  `clabe_interbancaria` varchar(18) DEFAULT NULL,
  `actividades` text DEFAULT NULL COMMENT 'Solo para persona física con actividad empresarial',
  `objeto_social` text DEFAULT NULL COMMENT 'Solo para persona moral',
  `num_acta_constitutiva` varchar(50) DEFAULT NULL,
  `fecha_acta_constitutiva` date DEFAULT NULL,
  `num_notario_acta` varchar(50) DEFAULT NULL,
  `nombre_notario_acta` varchar(255) DEFAULT NULL,
  `ciudad_acta` varchar(100) DEFAULT NULL,
  `folio_mercantil` varchar(50) DEFAULT NULL,
  `fecha_registro_acta` date DEFAULT NULL,
  `poder_notarial_num` varchar(50) DEFAULT NULL,
  `poder_notarial_fecha` date DEFAULT NULL,
  `poder_notarial_notario_num` varchar(50) DEFAULT NULL,
  `poder_notarial_notario_nombre` varchar(255) DEFAULT NULL,
  `poder_notarial_ciudad` varchar(100) DEFAULT NULL,
  `poder_notarial_folio` varchar(50) DEFAULT NULL,
  `poder_notarial_fecha_registro` date DEFAULT NULL,
  `apoderados` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `user_id`, `tipo_proveedor`, `rfc`, `razon_social`, `regimen_fiscal`, `nombre_vialidad`, `num_exterior`, `num_interior`, `colonia`, `localidad`, `codigo_postal`, `ciudad`, `estado`, `telefono`, `extension`, `fax`, `fax_extension`, `representante_legal`, `email`, `banco`, `sucursal_bancaria`, `cuenta_bancaria`, `clabe_interbancaria`, `actividades`, `objeto_social`, `num_acta_constitutiva`, `fecha_acta_constitutiva`, `num_notario_acta`, `nombre_notario_acta`, `ciudad_acta`, `folio_mercantil`, `fecha_registro_acta`, `poder_notarial_num`, `poder_notarial_fecha`, `poder_notarial_notario_num`, `poder_notarial_notario_nombre`, `poder_notarial_ciudad`, `poder_notarial_folio`, `poder_notarial_fecha_registro`, `apoderados`, `created_at`, `updated_at`) VALUES
(1, 5, 'general', '022817y6hhjjk', '23123', 'asda', 'dsda', '122', '122', 'sadsa', 'adasd', '1222', 'asdasda', 'adada', '4492892012', '323', '12313123', '122', 'adasdas', 'diegodelgadocampos254@gmail.com', 'asdasd', 'asdasdad', '1231312312312312', '1231313', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-06 23:49:56', '2026-04-07 00:05:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `roles`
--

INSERT INTO `roles` (`id`, `nombre`, `descripcion`, `creado_en`) VALUES
(1, 'Ofertante', 'Ofertante que da de alta sus datos para el ISSEA', '2026-03-22 21:58:11'),
(2, 'institucion_publica', 'Institución pública que revisa solicitudes', '2026-03-22 21:58:11'),
(3, 'privado', 'Usuario privado sin acceso a módulo de proveedores', '2026-03-22 21:58:11');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `rol_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `actualizado_en` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `rol_id`, `email`, `contrasena`, `telefono`, `creado_en`, `actualizado_en`) VALUES
(1, 1, 'proveedor1@ejemplo.com', '$2y$10$r/yK3i/JESgtSHoo5lDPAOaZtJMp9rd6UA2sFvO.Tnvy5hyZCDpTK', '5551234567', '2026-03-22 22:24:19', '2026-03-22 22:30:52'),
(2, 2, 'compras@issea.gob.mx', '$2y$10$/eaqqWxx8HF9ZtDaGU1I0uEKLrQCu77/C.Gzz6zFXqyBT8O3Fw7N2', '5559876543', '2026-03-22 22:24:19', '2026-03-22 22:30:52'),
(3, 3, 'usuario@privado.com', '$2y$10$CoA2x5MlzEoiU3Iu0bWhoeSSP4vvhgMVST9fPU.5NhIUrNiJN7QYu', '5554567890', '2026-03-22 22:24:19', '2026-03-22 22:30:52'),
(5, 2, 'diego@gmail.com', '$2y$10$IaWefgB249/.noQvpUCSMe2wAFdRboq/8Lw8nclD69tDY2p7dMqt.', '4492892012', '2026-03-24 23:00:30', '2026-03-24 23:00:30'),
(6, 3, 'campos@gmail.com', '$2y$10$VOodHcwBjpY2uWzYFdlLsum5wB.dL63FfHRKiQxhHuWCp88LtTVLK', '4492892012', '2026-03-30 23:39:22', '2026-03-30 23:39:22');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_type` (`user_id`,`tipo_proveedor`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nombre` (`nombre`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `rol_id` (`rol_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD CONSTRAINT `proveedores_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
