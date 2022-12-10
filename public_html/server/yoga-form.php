<?php
declare(strict_types=1);
include("validation.php");

define("FIELDS", array("full_name", "company_name", "mats", "goal[]", "classes[]"));

function validatePOSTInput()
{
  $validation = new ValidationResult();

  foreach (FIELDS as $value) {
    if (empty($_POST[$value]))
      $validation->addError("$value is missing");
  }

  return $validation;
}

$validation = validatePOSTInput();

echo json_encode($validation->getResult());
?>