<?php
declare(strict_types=1);
include("validation.php");

enum GoalOption
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

enum ClassDurationOption
{
  case One;
  case Five;
  case Ten;
  case Twenty;
}





define("FIELDS", array("full_name", "company_name", "mats_required", "goal_of_class", "class_duration"));

function validatePOSTInput()
{
  $validation = new ValidationResult();

  foreach (FIELDS as $value) {
    if (empty($_POST[$value]))
      $validation->addError("$value is missing");
    if ($value === "goal_of_class") {
      $valToEnum = GoalOption::from($value);
      var_dump($valToEnum);
    }
  }

  return $validation;
}

$validation = validatePOSTInput();

echo json_encode($validation->getResult());
?>