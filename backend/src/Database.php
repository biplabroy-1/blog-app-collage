<?php

namespace App;

use MongoDB\Client;
// Remove import of MongoDB\Database as it conflicts with class name

class Database {
    private static ?\MongoDB\Database $instance = null;
    private static ?Client $client = null;

    public static function getInstance(): \MongoDB\Database {
        if (self::$instance === null) {
            self::$client = new Client(
                "mongodb://" . DB_HOST . ":" . DB_PORT,
                []
            );
            self::$instance = self::$client->selectDatabase(DB_NAME);
        }
        return self::$instance;
    }

    public static function getCollection(string $name) {
        return self::getInstance()->selectCollection($name);
    }
}

