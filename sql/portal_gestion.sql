-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 07-07-2026 a las 03:07:04
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
(16, 2, 'venta de Calcetines', 20.00, '2026-05-05', '2026-07-07 00:55:08', '2026-07-07 00:55:08'),
(17, 2, 'venta', 12.00, '2026-05-03', '2026-07-07 00:55:08', '2026-07-07 00:55:08');

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
-- Estructura de tabla para la tabla `categorias_nivel_1`
--

CREATE TABLE `categorias_nivel_1` (
  `codigo` char(5) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias_nivel_1`
--

INSERT INTO `categorias_nivel_1` (`codigo`, `nombre`, `activo`, `created_at`) VALUES
('20000', 'MATERIALES Y SUMINISTROS', 1, '2026-07-05 20:19:31'),
('30000', 'SERVICIOS GENERALES', 1, '2026-07-05 20:19:31'),
('50000', 'BIENES MUEBLES, INMUEBLES E INTANGIBLES', 1, '2026-07-05 20:19:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_nivel_2`
--

CREATE TABLE `categorias_nivel_2` (
  `codigo` char(5) NOT NULL,
  `nivel_1_codigo` char(5) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias_nivel_2`
--

INSERT INTO `categorias_nivel_2` (`codigo`, `nivel_1_codigo`, `nombre`, `activo`, `created_at`) VALUES
('21000', '20000', 'MATERIALES DE ADMINISTRACION, EMISION DE DOCUMENTOS Y ARTICULOS OFICIALES', 1, '2026-07-05 20:19:31'),
('22000', '20000', 'ALIMENTOS Y UTENSILIOS', 1, '2026-07-05 20:19:31'),
('23000', '20000', 'MATERIAS PRIMAS Y MATERIALES DE PRODUCCION Y COMERCIALIZACION', 1, '2026-07-05 20:19:31'),
('24000', '20000', 'MATERIALES Y ARTICULOS DE CONSTRUCCION Y DE REPARACION', 1, '2026-07-05 20:19:31'),
('25000', '20000', 'PRODUCTOS QUIMICOS, FARMACEUTICOS Y DE LABORATORIO', 1, '2026-07-05 20:19:31'),
('26000', '20000', 'COMBUSTIBLES, LUBRICANTES Y ADITIVOS', 1, '2026-07-05 20:19:31'),
('27000', '20000', 'VESTUARIO, BLANCOS, PRENDAS DE PROTECCION Y ARTICULOS DEPORTIVOS', 1, '2026-07-05 20:19:31'),
('28000', '20000', 'MATERIALES Y SUMINISTROS PARA SEGURIDAD', 1, '2026-07-05 20:19:31'),
('29000', '20000', 'HERRAMIENTAS, REFACCIONES Y ACCESORIOS MENORES', 1, '2026-07-05 20:19:31'),
('31000', '30000', 'SERVICIOS BASICOS', 1, '2026-07-05 20:19:31'),
('32000', '30000', 'SERVICIOS DE ARRENDAMIENTO', 1, '2026-07-05 20:19:31'),
('33000', '30000', 'SERVICIOS PROFESIONALES, CIENTIFICOS, TECNICOS Y OTROS SERVICIOS', 1, '2026-07-05 20:19:31'),
('34000', '30000', 'SERVICIOS FINANCIEROS, BANCARIOS Y COMERCIALES', 1, '2026-07-05 20:19:31'),
('35000', '30000', 'SERVICIOS DE INSTALACION, REPARACION, MANTENIMIENTO Y CONSERVACION', 1, '2026-07-05 20:19:31'),
('36000', '30000', 'SERVICIOS DE COMUNICACION SOCIAL Y PUBLICIDAD', 1, '2026-07-05 20:19:31'),
('37000', '30000', 'SERVICIOS DE TRASLADO Y VIATICOS', 1, '2026-07-05 20:19:31'),
('38000', '30000', 'SERVICIOS OFICIALES', 1, '2026-07-05 20:19:31'),
('39000', '30000', 'OTROS SERVICIOS GENERALES', 1, '2026-07-05 20:19:31'),
('51000', '50000', 'MOBILIARIO Y EQUIPO DE ADMINISTRACION', 1, '2026-07-05 20:19:31'),
('52000', '50000', 'MOBILIARIO Y EQUIPO EDUCACIONAL Y RECREATIVO', 1, '2026-07-05 20:19:31'),
('53000', '50000', 'EQUIPO E INSTRUMENTAL MEDICO Y DE LABORATORIO', 1, '2026-07-05 20:19:31'),
('54000', '50000', 'VEHICULOS Y EQUIPO DE TRANSPORTE', 1, '2026-07-05 20:19:31'),
('55000', '50000', 'EQUIPO DE DEFENSA Y SEGURIDAD', 1, '2026-07-05 20:19:31'),
('56000', '50000', 'MAQUINARIA, OTROS EQUIPOS Y HERRAMIENTAS', 1, '2026-07-05 20:19:31'),
('57000', '50000', 'ACTIVOS BIOLOGICOS', 1, '2026-07-05 20:19:31'),
('58000', '50000', 'BIENES INMUEBLES', 1, '2026-07-05 20:19:31'),
('59000', '50000', 'ACTIVOS INTANGIBLES', 1, '2026-07-05 20:19:31');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_nivel_3`
--

CREATE TABLE `categorias_nivel_3` (
  `codigo` char(5) NOT NULL,
  `nivel_2_codigo` char(5) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Volcado de datos para la tabla `categorias_nivel_3`
--

INSERT INTO `categorias_nivel_3` (`codigo`, `nivel_2_codigo`, `nombre`, `activo`, `created_at`) VALUES
('21100', '21000', 'Materiales, útiles y equipos menores de oficina', 1, '2026-07-05 20:19:31'),
('21200', '21000', 'Materiales y útiles de impresión y reproducción', 1, '2026-07-05 20:19:31'),
('21300', '21000', 'Material estadístico y geográfico', 1, '2026-07-05 20:19:31'),
('21400', '21000', 'Materiales, útiles y equipos menores de tecnologías de la información y comunicaciones', 1, '2026-07-05 20:19:31'),
('21500', '21000', 'Material impreso e información digital', 1, '2026-07-05 20:19:31'),
('21600', '21000', 'Material de limpieza', 1, '2026-07-05 20:19:31'),
('21700', '21000', 'Materiales y útiles de enseñanza', 1, '2026-07-05 20:19:31'),
('21800', '21000', 'Materiales para el registro e identificación de bienes y personas', 1, '2026-07-05 20:19:31'),
('22100', '22000', 'Productos alimenticios para personas', 1, '2026-07-05 20:19:31'),
('22200', '22000', 'Productos alimenticios para animales', 1, '2026-07-05 20:19:31'),
('22300', '22000', 'Utensilios para el servicio de alimentación', 1, '2026-07-05 20:19:31'),
('23100', '23000', 'Productos alimenticios, agropecuarios y forestales adquiridos como materia prima', 1, '2026-07-05 20:19:31'),
('23200', '23000', 'Insumos textiles adquiridos como materia prima', 1, '2026-07-05 20:19:31'),
('23300', '23000', 'Productos de papel, cartón e impresos adquiridos como materia prima', 1, '2026-07-05 20:19:31'),
('23400', '23000', 'Combustibles, lubricantes, aditivos, carbón y sus derivados adquiridos como materia prima', 1, '2026-07-05 20:19:31'),
('23500', '23000', 'Productos químicos, farmacéuticos y de laboratorio adquiridos como materia prima', 1, '2026-07-05 20:19:31'),
('23600', '23000', 'Productos metálicos y a base de minerales no metálicos adquiridos como materia prima', 1, '2026-07-05 20:19:31'),
('23700', '23000', 'Productos de cuero, piel, plástico y hule adquiridos como materia prima', 1, '2026-07-05 20:19:31'),
('23800', '23000', 'Mercancías adquiridas para su comercialización', 1, '2026-07-05 20:19:31'),
('23900', '23000', 'Otros productos adquiridos como materia prima', 1, '2026-07-05 20:19:31'),
('24100', '24000', 'Productos minerales no metálicos', 1, '2026-07-05 20:19:31'),
('24200', '24000', 'Cemento y productos de concreto', 1, '2026-07-05 20:19:31'),
('24300', '24000', 'Cal, yeso y productos de yeso', 1, '2026-07-05 20:19:31'),
('24400', '24000', 'Madera y productos de madera', 1, '2026-07-05 20:19:31'),
('24500', '24000', 'Vidrio y productos de vidrio', 1, '2026-07-05 20:19:31'),
('24600', '24000', 'Material eléctrico y electrónico', 1, '2026-07-05 20:19:31'),
('24700', '24000', 'Artículos metálicos para la construcción', 1, '2026-07-05 20:19:31'),
('24800', '24000', 'Materiales complementarios', 1, '2026-07-05 20:19:31'),
('24900', '24000', 'Otros materiales y artículos de construcción y reparación', 1, '2026-07-05 20:19:31'),
('25100', '25000', 'Productos químicos básicos', 1, '2026-07-05 20:19:31'),
('25200', '25000', 'Fertilizantes, pesticidas y otros agroquímicos', 1, '2026-07-05 20:19:31'),
('25300', '25000', 'Medicinas y productos farmacéuticos', 1, '2026-07-05 20:19:31'),
('25400', '25000', 'Materiales, accesorios y suministros médicos', 1, '2026-07-05 20:19:31'),
('25500', '25000', 'Materiales, accesorios y suministros de laboratorio', 1, '2026-07-05 20:19:31'),
('25600', '25000', 'Fibras sintéticas, hules, plásticos y derivados', 1, '2026-07-05 20:19:31'),
('25900', '25000', 'Otros productos químicos', 1, '2026-07-05 20:19:31'),
('26100', '26000', 'Combustibles, lubricantes y aditivos', 1, '2026-07-05 20:19:31'),
('26200', '26000', 'Carbón y sus derivados', 1, '2026-07-05 20:19:31'),
('27100', '27000', 'Vestuario y uniformes', 1, '2026-07-05 20:19:31'),
('27200', '27000', 'Prendas de seguridad y protección personal', 1, '2026-07-05 20:19:31'),
('27300', '27000', 'Artículos deportivos', 1, '2026-07-05 20:19:31'),
('27400', '27000', 'Productos textiles', 1, '2026-07-05 20:19:31'),
('27500', '27000', 'Blancos y otros productos textiles, excepto prendas de vestir', 1, '2026-07-05 20:19:31'),
('28100', '28000', 'Sustancias y materiales explosivos', 1, '2026-07-05 20:19:31'),
('28200', '28000', 'Materiales de seguridad pública', 1, '2026-07-05 20:19:31'),
('28300', '28000', 'Prendas de protección para seguridad pública y nacional', 1, '2026-07-05 20:19:31'),
('29100', '29000', 'Herramientas menores', 1, '2026-07-05 20:19:31'),
('29200', '29000', 'Refacciones y accesorios menores de edificios', 1, '2026-07-05 20:19:31'),
('29300', '29000', 'Refacciones y accesorios menores de mobiliario y equipo de administración, educacional y recreativo', 1, '2026-07-05 20:19:31'),
('29400', '29000', 'Refacciones y accesorios menores de equipo de cómputo y tecnologías de la información', 1, '2026-07-05 20:19:31'),
('29500', '29000', 'Refacciones y accesorios menores de equipo e instrumental médico y de laboratorio', 1, '2026-07-05 20:19:31'),
('29600', '29000', 'Refacciones y accesorios menores de equipo de transporte', 1, '2026-07-05 20:19:31'),
('29700', '29000', 'Refacciones y accesorios menores de equipo de defensa y seguridad', 1, '2026-07-05 20:19:31'),
('29800', '29000', 'Refacciones y accesorios menores de maquinaria y otros equipos', 1, '2026-07-05 20:19:31'),
('29900', '29000', 'Refacciones y accesorios menores otros bienes muebles', 1, '2026-07-05 20:19:31'),
('31100', '31000', 'Energía eléctrica', 1, '2026-07-05 20:19:31'),
('31200', '31000', 'Gas', 1, '2026-07-05 20:19:31'),
('31300', '31000', 'Agua', 1, '2026-07-05 20:19:31'),
('31400', '31000', 'Telefonía tradicional', 1, '2026-07-05 20:19:31'),
('31500', '31000', 'Telefonía celular', 1, '2026-07-05 20:19:31'),
('31600', '31000', 'Servicios de telecomunicaciones y satélites', 1, '2026-07-05 20:19:31'),
('31700', '31000', 'Servicios de acceso de Internet, redes y procesamiento de información', 1, '2026-07-05 20:19:31'),
('31800', '31000', 'Servicios postales y telegráficos', 1, '2026-07-05 20:19:31'),
('31900', '31000', 'Servicios integrales y otros servicios', 1, '2026-07-05 20:19:31'),
('32100', '32000', 'Arrendamiento de terrenos', 1, '2026-07-05 20:19:31'),
('32200', '32000', 'Arrendamiento de edificios', 1, '2026-07-05 20:19:31'),
('32300', '32000', 'Arrendamiento de mobiliario y equipo de administración, educacional y recreativo', 1, '2026-07-05 20:19:31'),
('32400', '32000', 'Arrendamiento de equipo e instrumental médico y de laboratorio', 1, '2026-07-05 20:19:31'),
('32500', '32000', 'Arrendamiento de equipo de transporte', 1, '2026-07-05 20:19:31'),
('32600', '32000', 'Arrendamiento de maquinaria, otros equipos y herramientas', 1, '2026-07-05 20:19:31'),
('32700', '32000', 'Arrendamiento de activos intangibles', 1, '2026-07-05 20:19:31'),
('32800', '32000', 'Arrendamiento financiero', 1, '2026-07-05 20:19:31'),
('32900', '32000', 'Otros arrendamientos', 1, '2026-07-05 20:19:31'),
('33100', '33000', 'Servicios legales, de contabilidad, auditoría y relacionados', 1, '2026-07-05 20:19:31'),
('33200', '33000', 'Servicios de diseño, arquitectura, ingeniería y actividades relacionadas', 1, '2026-07-05 20:19:31'),
('33300', '33000', 'Servicios de consultoría administrativa, procesos, técnica y en tecnologías de la información', 1, '2026-07-05 20:19:31'),
('33400', '33000', 'Servicios de capacitación', 1, '2026-07-05 20:19:31'),
('33500', '33000', 'Servicios de investigación científica y desarrollo', 1, '2026-07-05 20:19:31'),
('33600', '33000', 'Servicios de apoyo administrativo, fotocopiado e impresión', 1, '2026-07-05 20:19:31'),
('33700', '33000', 'Servicios de protección y seguridad', 1, '2026-07-05 20:19:31'),
('33800', '33000', 'Servicio de vigilancia', 1, '2026-07-05 20:19:31'),
('33900', '33000', 'Servicios profesionales, científicos y técnicos integrales', 1, '2026-07-05 20:19:31'),
('34100', '34000', 'Servicios financieros y bancarios', 1, '2026-07-05 20:19:31'),
('34200', '34000', 'Servicios de cobranza, investigación crediticia y similar', 1, '2026-07-05 20:19:31'),
('34300', '34000', 'Servicios de recaudación, traslado y custodia de valores', 1, '2026-07-05 20:19:31'),
('34400', '34000', 'Seguro de responsabilidad patrimonial y fianzas', 1, '2026-07-05 20:19:31'),
('34500', '34000', 'Seguro de bienes patrimoniales', 1, '2026-07-05 20:19:31'),
('34600', '34000', 'Almacenaje, envase y embalaje', 1, '2026-07-05 20:19:31'),
('34700', '34000', 'Fletes y maniobras', 1, '2026-07-05 20:19:31'),
('34800', '34000', 'Comisiones por ventas', 1, '2026-07-05 20:19:31'),
('34900', '34000', 'Servicios financieros, bancarios y comerciales integrales', 1, '2026-07-05 20:19:31'),
('35100', '35000', 'Conservación y mantenimiento menor de inmuebles', 1, '2026-07-05 20:19:31'),
('35200', '35000', 'Instalación, reparación y mantenimiento de mobiliario y equipo de administración, educacional y recreativo', 1, '2026-07-05 20:19:31'),
('35300', '35000', 'Instalación, reparación y mantenimiento de equipo de cómputo y tecnologías de la información', 1, '2026-07-05 20:19:31'),
('35400', '35000', 'Instalación, reparación y mantenimiento de equipo e instrumental médico y de laboratorio', 1, '2026-07-05 20:19:31'),
('35500', '35000', 'Reparación y mantenimiento de equipo de transporte', 1, '2026-07-05 20:19:31'),
('35600', '35000', 'Reparación y mantenimiento de equipo de defensa y seguridad', 1, '2026-07-05 20:19:31'),
('35700', '35000', 'Instalación, reparación y mantenimiento de maquinaria, otros equipos y herramienta', 1, '2026-07-05 20:19:31'),
('35800', '35000', 'Servicios de limpieza y manejo de desechos', 1, '2026-07-05 20:19:31'),
('35900', '35000', 'Servicios de jardinería y fumigación', 1, '2026-07-05 20:19:31'),
('36100', '36000', 'Difusión por radio, televisión y otros medios de mensajes sobre programas y actividades gubernamentales', 1, '2026-07-05 20:19:31'),
('36200', '36000', 'Difusión por radio, televisión y otros medios de mensajes comerciales para promover la venta de bienes o servicios', 1, '2026-07-05 20:19:31'),
('36300', '36000', 'Servicios de creatividad, preproducción y producción de publicidad, excepto Internet', 1, '2026-07-05 20:19:31'),
('36400', '36000', 'Servicios de revelado de fotografías', 1, '2026-07-05 20:19:31'),
('36500', '36000', 'Servicios de la industria filmica, del sonido y del video', 1, '2026-07-05 20:19:31'),
('36600', '36000', 'Servicio de creación y difusión de contenido exclusivamente a través de Internet', 1, '2026-07-05 20:19:31'),
('36900', '36000', 'Otros servicios de información', 1, '2026-07-05 20:19:31'),
('37100', '37000', 'Pasajes aéreos', 1, '2026-07-05 20:19:31'),
('37200', '37000', 'Pasajes terrestres', 1, '2026-07-05 20:19:31'),
('37300', '37000', 'Pasajes marítimos, lacustres y fluviales', 1, '2026-07-05 20:19:31'),
('37400', '37000', 'Autotransporte', 1, '2026-07-05 20:19:31'),
('37500', '37000', 'Viáticos en el país', 1, '2026-07-05 20:19:31'),
('37600', '37000', 'Viáticos en el extranjero', 1, '2026-07-05 20:19:31'),
('37700', '37000', 'Gastos de instalación y traslado de menaje', 1, '2026-07-05 20:19:31'),
('37800', '37000', 'Servicios integrales de traslado y viáticos', 1, '2026-07-05 20:19:31'),
('37900', '37000', 'Otros servicios de traslado y hospedaje', 1, '2026-07-05 20:19:31'),
('38100', '38000', 'Gastos de ceremonial', 1, '2026-07-05 20:19:31'),
('38200', '38000', 'Gastos de orden social y cultural', 1, '2026-07-05 20:19:31'),
('38300', '38000', 'Congresos y convenciones', 1, '2026-07-05 20:19:31'),
('38400', '38000', 'Exposiciones', 1, '2026-07-05 20:19:31'),
('38500', '38000', 'Gastos de representación', 1, '2026-07-05 20:19:31'),
('39100', '39000', 'Servicios funerarios y de cementerios', 1, '2026-07-05 20:19:31'),
('39200', '39000', 'Impuestos y derechos', 1, '2026-07-05 20:19:31'),
('39300', '39000', 'Impuestos y derechos de importación', 1, '2026-07-05 20:19:31'),
('39400', '39000', 'Sentencias y resoluciones por autoridad competente', 1, '2026-07-05 20:19:31'),
('39500', '39000', 'Penas, multas, accesorios y actualizaciones', 1, '2026-07-05 20:19:31'),
('39600', '39000', 'Otros gastos por responsabilidades', 1, '2026-07-05 20:19:31'),
('39700', '39000', 'Utilidades', 1, '2026-07-05 20:19:31'),
('39800', '39000', 'Impuesto sobre nóminas y otros que se deriven de una relación laboral', 1, '2026-07-05 20:19:31'),
('39900', '39000', 'Otros servicios generales', 1, '2026-07-05 20:19:31'),
('51100', '51000', 'Muebles de oficina y estantería', 1, '2026-07-05 20:19:31'),
('51200', '51000', 'Muebles, excepto de oficina y estantería', 1, '2026-07-05 20:19:31'),
('51300', '51000', 'Bienes artísticos, culturales y científicos', 1, '2026-07-05 20:19:31'),
('51400', '51000', 'Objetos de valor', 1, '2026-07-05 20:19:31'),
('51500', '51000', 'Equipo de cómputo y de tecnologías de la información', 1, '2026-07-05 20:19:31'),
('51900', '51000', 'Otros mobiliarios y equipos de administración', 1, '2026-07-05 20:19:31'),
('52100', '52000', 'Equipos y aparatos audiovisuales', 1, '2026-07-05 20:19:31'),
('52200', '52000', 'Aparatos deportivos', 1, '2026-07-05 20:19:31'),
('52300', '52000', 'Cámaras fotográficas y de video', 1, '2026-07-05 20:19:31'),
('52900', '52000', 'otro mobiliario y equipo educacional y recreativo', 1, '2026-07-05 20:19:31'),
('53100', '53000', 'Equipo médico y de laboratorio', 1, '2026-07-05 20:19:31'),
('53200', '53000', 'Instrumental médico y de laboratorio', 1, '2026-07-05 20:19:31'),
('54100', '54000', 'Vehículos y equipo terrestre', 1, '2026-07-05 20:19:31'),
('54200', '54000', 'Carrocerías y remolques', 1, '2026-07-05 20:19:31'),
('54300', '54000', 'Equipo aeroespacial', 1, '2026-07-05 20:19:31'),
('54400', '54000', 'Equipo ferroviario', 1, '2026-07-05 20:19:31'),
('54500', '54000', 'Embarcaciones', 1, '2026-07-05 20:19:31'),
('54900', '54000', 'Otros equipos de transporte', 1, '2026-07-05 20:19:31'),
('55100', '55000', 'Equipo de defensa y seguridad', 1, '2026-07-05 20:19:31'),
('56100', '56000', 'Maquinaria y equipo agropecuario', 1, '2026-07-05 20:19:31'),
('56200', '56000', 'Maquinaria y equipo industrial', 1, '2026-07-05 20:19:31'),
('56300', '56000', 'Maquinaria y equipo de construcción', 1, '2026-07-05 20:19:31'),
('56400', '56000', 'Sistemas de aire acondicionado, calefacción y de refrigeración industrial y comercial', 1, '2026-07-05 20:19:31'),
('56500', '56000', 'Equipo de comunicación y telecomunicación', 1, '2026-07-05 20:19:31'),
('56600', '56000', 'Equipos de generación eléctrica, aparatos y accesorios eléctricos', 1, '2026-07-05 20:19:31'),
('56700', '56000', 'Herramientas y máquinas-herramienta', 1, '2026-07-05 20:19:31'),
('56900', '56000', 'Otros equipos', 1, '2026-07-05 20:19:31'),
('57100', '57000', 'Bovinos', 1, '2026-07-05 20:19:31'),
('57200', '57000', 'Porcinos', 1, '2026-07-05 20:19:31'),
('57300', '57000', 'Aves', 1, '2026-07-05 20:19:31'),
('57400', '57000', 'Ovinos y caprinos', 1, '2026-07-05 20:19:31'),
('57500', '57000', 'Peces y acuicultura', 1, '2026-07-05 20:19:31'),
('57600', '57000', 'Equinos', 1, '2026-07-05 20:19:31'),
('57700', '57000', 'Especies menores y de zoológico', 1, '2026-07-05 20:19:31'),
('57800', '57000', 'Arboles y plantas', 1, '2026-07-05 20:19:31'),
('57900', '57000', 'Otros activos biológicos', 1, '2026-07-05 20:19:31'),
('58100', '58000', 'Terrenos', 1, '2026-07-05 20:19:31'),
('58200', '58000', 'Viviendas', 1, '2026-07-05 20:19:31'),
('58300', '58000', 'Edificios no residenciales', 1, '2026-07-05 20:19:31'),
('58900', '58000', 'Otros bienes inmuebles', 1, '2026-07-05 20:19:31'),
('59100', '59000', 'Software', 1, '2026-07-05 20:19:31'),
('59200', '59000', 'Patentes', 1, '2026-07-05 20:19:31'),
('59300', '59000', 'Marcas', 1, '2026-07-05 20:19:31'),
('59400', '59000', 'Derechos', 1, '2026-07-05 20:19:31'),
('59500', '59000', 'Concesiones', 1, '2026-07-05 20:19:31'),
('59600', '59000', 'Franquicias', 1, '2026-07-05 20:19:31'),
('59700', '59000', 'Licencias informáticas e intelectuales', 1, '2026-07-05 20:19:31'),
('59800', '59000', 'Licencias industriales, comerciales y otras', 1, '2026-07-05 20:19:31'),
('59900', '59000', 'Otros activos intangibles', 1, '2026-07-05 20:19:31');

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
  `nombre_comercial` varchar(255) DEFAULT NULL,
  `descripcion_actividad` text DEFAULT NULL,
  `palabras_clave` text DEFAULT NULL,
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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `categoria_nivel_1` int(11) DEFAULT NULL,
  `categoria_nivel_2` int(11) DEFAULT NULL,
  `categoria_nivel_3` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `user_id`, `tipo_proveedor`, `rfc`, `razon_social`, `nombre_comercial`, `descripcion_actividad`, `palabras_clave`, `regimen_fiscal`, `nombre_vialidad`, `num_exterior`, `num_interior`, `colonia`, `localidad`, `codigo_postal`, `ciudad`, `estado`, `telefono`, `extension`, `fax`, `fax_extension`, `representante_legal`, `email`, `banco`, `sucursal_bancaria`, `cuenta_bancaria`, `clabe_interbancaria`, `objeto_social`, `num_acta_constitutiva`, `fecha_acta_constitutiva`, `num_notario_acta`, `nombre_notario_acta`, `ciudad_acta`, `folio_mercantil`, `fecha_registro_acta`, `poder_notarial_num`, `poder_notarial_fecha`, `poder_notarial_notario_num`, `poder_notarial_notario_nombre`, `poder_notarial_ciudad`, `poder_notarial_folio`, `poder_notarial_fecha_registro`, `apoderados`, `created_at`, `updated_at`, `categoria_nivel_1`, `categoria_nivel_2`, `categoria_nivel_3`) VALUES
(1, 5, 'general', '022817y6hhjjk', '23123', NULL, NULL, NULL, 'asda', 'dsda', '122', '122', 'sadsa', 'adasd', '1222', 'asdasda', 'adada', '4492892012', '323', '12313123', '122', 'adasdas', 'diegodelgadocampos254@gmail.com', 'asdasd', 'asdasdad', '1231312312312312', '1231313', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-06 23:49:56', '2026-04-07 00:05:09', NULL, NULL, NULL),
(2, 1, 'fisica_empresarial', 'caddd2222|', '23123', 'Reparacion de equipos de computo Campos', 'Reparacion de equipos de computo, instalacion de software necesario', 'Software, Hardware, Computo', 'asda', 'skajsdjalskdjas', '566', '302', 'Arboledas', 'Aguascalientes', '20188', 'Aguascalientes', 'Aguascalientes', '4492892012', '323', '12313123', '122', 'adasdas', 'diegodelgadocampos254@gmail.com', 'asdasd', 'asdasdad', '1231312312312312', '1231313', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-04-18 22:53:49', '2026-07-05 20:45:20', 30000, 35000, 35300),
(3, 1, 'moral', 'caddd2222|', '23123', NULL, NULL, NULL, 'asda', 'dsda', '122', '122', 'sadsa', 'adasd', '1222', 'asdasda', 'adada', '4492892012', '323', '12313123', '122', 'adasdas', 'diegodelgadocampos254@gmail.com', 'asdasd', 'asdasdad', '1231312312312312', '1231313', 'ASD', '1231123', '2026-05-04', '1233131', '1231ASDASDA', 'ASDASDAS', 'ADS312313', '2026-05-04', 'N/A', '2026-05-04', '112313131', 'dasdasda', 'asdas', 'asdas', '2026-05-04', 'asddsa', '2026-05-04 23:20:27', '2026-05-04 23:20:27', NULL, NULL, NULL);

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

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vw_categorias_concierge`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vw_categorias_concierge` (
`nivel_1_codigo` char(5)
,`nivel_1_nombre` varchar(255)
,`nivel_2_codigo` char(5)
,`nivel_2_nombre` varchar(255)
,`nivel_3_codigo` char(5)
,`nivel_3_nombre` varchar(255)
,`ruta_categoria` text
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vw_categorias_concierge`
--
DROP TABLE IF EXISTS `vw_categorias_concierge`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vw_categorias_concierge`  AS SELECT `n1`.`codigo` AS `nivel_1_codigo`, `n1`.`nombre` AS `nivel_1_nombre`, `n2`.`codigo` AS `nivel_2_codigo`, `n2`.`nombre` AS `nivel_2_nombre`, `n3`.`codigo` AS `nivel_3_codigo`, `n3`.`nombre` AS `nivel_3_nombre`, concat(`n1`.`codigo`,' - ',`n1`.`nombre`,' > ',`n2`.`codigo`,' - ',`n2`.`nombre`,' > ',`n3`.`codigo`,' - ',`n3`.`nombre`) AS `ruta_categoria` FROM ((`categorias_nivel_1` `n1` join `categorias_nivel_2` `n2` on(`n2`.`nivel_1_codigo` = `n1`.`codigo`)) join `categorias_nivel_3` `n3` on(`n3`.`nivel_2_codigo` = `n2`.`codigo`)) WHERE `n1`.`activo` = 1 AND `n2`.`activo` = 1 AND `n3`.`activo` = 1 ;

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
-- Indices de la tabla `categorias_nivel_1`
--
ALTER TABLE `categorias_nivel_1`
  ADD PRIMARY KEY (`codigo`);

--
-- Indices de la tabla `categorias_nivel_2`
--
ALTER TABLE `categorias_nivel_2`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `idx_nivel2_nivel1` (`nivel_1_codigo`);

--
-- Indices de la tabla `categorias_nivel_3`
--
ALTER TABLE `categorias_nivel_3`
  ADD PRIMARY KEY (`codigo`),
  ADD KEY `idx_nivel3_nivel2` (`nivel_2_codigo`);
ALTER TABLE `categorias_nivel_3` ADD FULLTEXT KEY `ft_categoria_n3_nombre` (`nombre`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_type` (`user_id`,`tipo_proveedor`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_proveedores_cat_n1` (`categoria_nivel_1`),
  ADD KEY `idx_proveedores_cat_n2` (`categoria_nivel_2`),
  ADD KEY `idx_proveedores_cat_n3` (`categoria_nivel_3`);

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

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
-- Filtros para la tabla `categorias_nivel_2`
--
ALTER TABLE `categorias_nivel_2`
  ADD CONSTRAINT `fk_categoria_n2_n1` FOREIGN KEY (`nivel_1_codigo`) REFERENCES `categorias_nivel_1` (`codigo`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `categorias_nivel_3`
--
ALTER TABLE `categorias_nivel_3`
  ADD CONSTRAINT `fk_categoria_n3_n2` FOREIGN KEY (`nivel_2_codigo`) REFERENCES `categorias_nivel_2` (`codigo`) ON UPDATE CASCADE;

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
