<?php
declare(strict_types=1);
include("validation.php");

$result = new ValidationResult();
$result->errors[0] = "Should've had a valid name";
echo json_encode($result);
?>