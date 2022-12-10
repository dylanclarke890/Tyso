<?php
declare(strict_types=1);
include("validation.php");

define("FIELDS", array("full_name", "company_name", "mats", "goal[]", "classes[]"));

function validatePOSTInput()
{
  $validation = new ValidationResult();

  foreach (FIELDS as $value) {
    if (!isset($_POST[$value]))
      $validation->addError("$value isn't set");
  }

  return $validation;
}

$validation = validatePOSTInput();


echo ($validation->succeeded() ? "True" : "False");
// echo json_encode(FIELDS);
// echo json_encode($validation->getResult());
exit();
?>