<?php

/**
 * Front controller
 *
 * PHP version 7.0
 */

/**
 * Composer
 */
require dirname(__DIR__) . '/vendor/autoload.php';


/**
 * Error and Exception handling
 */
error_reporting(E_ALL);
set_error_handler('Core\Error::errorHandler');
set_exception_handler('Core\Error::exceptionHandler');


/**
 * Sessions
 */
session_start();


/**
 * Routing
 */
$router = new Core\Router();
$router->add('', ['controller' => 'Home', 'action' => 'index']);
$router->add('Login', ['controller' => 'Login', 'action' => 'Signin']);
$router->add('Products', ['controller' => 'Products', 'action' => 'index']);
$router->add('Products/test', ['controller' => 'Products', 'action' => 'test']);
$router->add('Products/search', ['controller' => 'Products', 'action' => 'search']);
$router->add('Products/create', ['controller' => 'Products', 'action' => 'create']);
$router->add('Products/update', ['controller' => 'Products', 'action' => 'update']);
$router->add('Products/delete', ['controller' => 'Products', 'action' => 'delete']);
$router->add('Products/manage', ['controller' => 'Products', 'action' => 'manage']);
$router->add('Products/api', ['controller' => 'Products', 'action' => 'apiTest']);
$router->add('{controller}/{action}');
$router->dispatch($_SERVER['QUERY_STRING']);


