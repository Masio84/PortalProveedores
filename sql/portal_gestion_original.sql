-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-07-2026 a las 22:07:48
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
-- Estructura de tabla para la tabla `accionistas`
--

CREATE TABLE `accionistas` (
  `id` int(11) NOT NULL,
  `proveedor_id` int(11) NOT NULL COMMENT 'FK a proveedores.id',
  `nombre_completo` varchar(255) NOT NULL,
  `curp` varchar(18) NOT NULL,
  `ine` varchar(18) NOT NULL,
  `fecha_alta` date NOT NULL,
  `fecha_baja` date DEFAULT NULL COMMENT 'NULL = activo, fecha = dado de baja',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `curp_activo` varchar(18) GENERATED ALWAYS AS (if(`fecha_baja` is null,`curp`,NULL)) STORED,
  `ine_activo` varchar(18) GENERATED ALWAYS AS (if(`fecha_baja` is null,`ine`,NULL)) STORED,
  `porcentaje_participacion` decimal(5,2) NOT NULL DEFAULT 0.00 COMMENT 'Porcentaje de participación del accionista (0-100)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `accionistas`
--

INSERT INTO `accionistas` (`id`, `proveedor_id`, `nombre_completo`, `curp`, `ine`, `fecha_alta`, `fecha_baja`, `created_at`, `updated_at`, `porcentaje_participacion`) VALUES
(1, 3, 'Jose Perez', 'CADD021202', '1231231231', '2026-05-04', '2026-05-04', '2026-05-04 23:20:58', '2026-05-04 23:21:34', 0.00),
(3, 3, 'Jose Perez Alvares', 'CADD023256', '5689974254', '2026-05-05', NULL, '2026-05-05 01:07:48', '2026-05-10 22:06:03', 10.00),
(4, 3, 'Ignacio Lopez Turrubiates', 'CADD55987', '88187277262', '2026-05-10', '2026-05-10', '2026-05-10 22:06:39', '2026-05-10 22:06:44', 100.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `actividades_economicas`
--

CREATE TABLE `actividades_economicas` (
  `id` int(11) NOT NULL,
  `proveedor_id` int(11) NOT NULL COMMENT 'FK a proveedores.id',
  `actividad` varchar(255) NOT NULL,
  `porcentaje` decimal(5,2) DEFAULT NULL COMMENT 'Porcentaje de dedicación',
  `fecha_inicio` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `actividades_economicas`
--

INSERT INTO `actividades_economicas` (`id`, `proveedor_id`, `actividad`, `porcentaje`, `fecha_inicio`, `created_at`, `updated_at`) VALUES
(7, 3, 'venta de gorditas', 2.00, '0000-00-00', '2026-05-05 01:07:55', '2026-05-05 01:07:55'),
(12, 2, 'venta de Calcetines', 20.00, '2026-05-05', '2026-05-11 02:39:01', '2026-05-11 02:39:01'),
(13, 2, 'venta', 12.00, '2026-05-03', '2026-05-11 02:39:01', '2026-05-11 02:39:01');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `apoderados_legales`
--

CREATE TABLE `apoderados_legales` (
  `id` int(11) NOT NULL,
  `proveedor_id` int(11) NOT NULL COMMENT 'FK a proveedores.id',
  `nombre_completo` varchar(255) NOT NULL,
  `curp` varchar(18) NOT NULL,
  `ine` varchar(18) NOT NULL,
  `fecha_alta` date NOT NULL,
  `fecha_baja` date DEFAULT NULL COMMENT 'NULL = activo, fecha = dado de baja',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `apoderados_legales`
--

INSERT INTO `apoderados_legales` (`id`, `proveedor_id`, `nombre_completo`, `curp`, `ine`, `fecha_alta`, `fecha_baja`, `created_at`, `updated_at`) VALUES
(1, 2, 'Diego Alejandro Campos', 'CADD021202HASMLGA1', '456774322', '2026-05-10', '2026-05-10', '2026-05-10 22:40:56', '2026-05-11 03:00:47'),
(2, 3, 'Diego Alejandro Campos', 'CADD021202HASMLGA1', '1235465789', '2026-05-11', '2026-05-11', '2026-05-11 03:01:01', '2026-05-11 22:35:50'),
(3, 2, 'Diego Alejandro Campos', 'CADD021202HASMLGA1', '1235465789', '2026-05-11', NULL, '2026-05-11 22:36:00', '2026-05-11 22:36:00');

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

INSERT INTO `proveedores` (`id`, `user_id`, `tipo_proveedor`, `rfc`, `razon_social`, `regimen_fiscal`, `nombre_vialidad`, `num_exterior`, `num_interior`, `colonia`, `localidad`, `codigo_postal`, `ciudad`, `estado`, `telefono`, `extension`, `fax`, `fax_extension`, `representante_legal`, `email`, `banco`, `sucursal_bancaria`, `cuenta_bancaria`, `clabe_interbancaria`, `objeto_social`, `num_acta_constitutiva`, `fecha_acta_constitutiva`, `num_notario_acta`, `nombre_notario_acta`, `ciudad_acta`, `folio_mercantil`, `fecha_registro_acta`, `poder_notarial_num`, `poder_notarial_fecha`, `poder_notarial_notario_num`, `poder_notarial_notario_nombre`, `poder_notarial_ciudad`, `poder_notarial_folio`, `poder_notarial_fecha_registro`, `apoderados`, `created_at`, `updated_at`) VALUES
(1, 5, 'general', '022817y6hhjjk', '23123', 'asda', 'dsda', '122', '122', 'sadsa', 'adasd', '1222', 'asdasda', 'adada', '4492892012', '323', '12313123', '122', 'adasdas', 'diegodelgadocampos254@gmail.com', 'asdasd', 'asdasdad', '1231312312312312', '1231313', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-06 23:49:56', '2026-04-07 00:05:09'),
(2, 1, 'fisica_empresarial', 'caddd2222|', '23123', 'asda', 'skajsdjalskdjas', '566', '302', 'Arboledas', 'Aguascalientes', '20188', 'Aguascalientes', 'Aguascalientes', '4492892012', '323', '12313123', '122', 'adasdas', 'diegodelgadocampos254@gmail.com', 'asdasd', 'asdasdad', '1231312312312312', '1231313', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 22:53:49', '2026-04-26 20:09:11'),
(3, 1, 'moral', 'caddd2222|', '23123', 'asda', 'dsda', '122', '122', 'sadsa', 'adasd', '1222', 'asdasda', 'adada', '4492892012', '323', '12313123', '122', 'adasdas', 'diegodelgadocampos254@gmail.com', 'asdasd', 'asdasdad', '1231312312312312', '1231313', 'ASD', '1231123', '2026-05-04', '1233131', '1231ASDASDA', 'ASDASDAS', 'ADS312313', '2026-05-04', 'N/A', '2026-05-04', '112313131', 'dasdasda', 'asdas', 'asdas', '2026-05-04', 'asddsa', '2026-05-04 23:20:27', '2026-05-04 23:20:27');

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
(5, 2, 'diego@gmail.com', '$2y$10$Y8HimR2ubdM/HCpLnfOkG.yIrhLOc2bpFlFAUTE7TXPDhVW5gg/KG', '4492892012', '2026-03-24 23:00:30', '2026-05-06 22:42:47'),
(6, 3, 'campos@gmail.com', '$2y$10$VOodHcwBjpY2uWzYFdlLsum5wB.dL63FfHRKiQxhHuWCp88LtTVLK', '4492892012', '2026-03-30 23:39:22', '2026-03-30 23:39:22');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `accionistas`
--
ALTER TABLE `accionistas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_curp_activo` (`curp_activo`),
  ADD UNIQUE KEY `idx_ine_activo` (`ine_activo`),
  ADD KEY `proveedor_id` (`proveedor_id`);

--
-- Indices de la tabla `actividades_economicas`
--
ALTER TABLE `actividades_economicas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `proveedor_id` (`proveedor_id`);

--
-- Indices de la tabla `apoderados_legales`
--
ALTER TABLE `apoderados_legales`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_curp_activo_apoderado` (`curp`,`fecha_baja`),
  ADD UNIQUE KEY `idx_ine_activo_apoderado` (`ine`,`fecha_baja`),
  ADD KEY `proveedor_id` (`proveedor_id`);

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
-- AUTO_INCREMENT de la tabla `accionistas`
--
ALTER TABLE `accionistas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `actividades_economicas`
--
ALTER TABLE `actividades_economicas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `apoderados_legales`
--
ALTER TABLE `apoderados_legales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
-- Filtros para la tabla `accionistas`
--
ALTER TABLE `accionistas`
  ADD CONSTRAINT `accionistas_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `actividades_economicas`
--
ALTER TABLE `actividades_economicas`
  ADD CONSTRAINT `actividades_economicas_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `apoderados_legales`
--
ALTER TABLE `apoderados_legales`
  ADD CONSTRAINT `apoderados_legales_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedores` (`id`) ON DELETE CASCADE;

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
