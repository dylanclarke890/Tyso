<?php
declare(strict_types=1);
include("validation.php");

enum GoalOption:string
{
  case Balance = "Balance";
  case Force = "Force";
  case Concentration = "Concentration";
  case Conscience = "Conscience";
  case TeamBuilding = "TeamBuilding";
  case Leadership = "Leadership";
  case YogaIntro = "YogaIntro";
  case MeditationIntro = "MeditationIntro";
}

enum ClassDurationOption:string
{
  case One = "One";
  case Five = "Five";
  case Ten = "Ten";
  case Twenty = "Twenty";
}

define("FIELDS", ["full_name", "company_name", "mats_required", "goal_of_class", "class_duration"]);

function validatePOSTInput()
{
  $validation = new ValidationResult();

  foreach (FIELDS as $value) {
    $inputValue = $_POST[$value];
    var_dump($inputValue);
    var_dump($_POST);
    if (empty($inputValue))
      $validation->addError("$value is missing");
    if ($value === "goal_of_class") {
      $valToEnum = GoalOption::from($inputValue);
      var_dump($valToEnum);
    }
  }

  return $validation;
}

$validation = validatePOSTInput();

echo json_encode($validation->getResult());
?>