<?php

include_once '../headers.php';

// Data
$posts = require('../data/posts.php');


// Request process
if (isset($_GET['id'])) {
    $post = array_filter($posts, function($post) {
        return $post['id'] == $_GET['id'];
    });
    if (count($post) > 0) {
        echo json_encode(array_pop($post));
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'The post does not exists.']);
    }
} else {
    echo json_encode(['posts' => $posts]);
}
