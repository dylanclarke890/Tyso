<?php
declare(strict_types=1);
include("validation.php");

$result = new ValidationResult();
echo json_encode($result->toJSON());
?>