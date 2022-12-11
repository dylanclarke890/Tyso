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

function validateInput()
{
  $validation = new ValidationResult();

  if (empty($_POST["full_name"])) {
    $validation->addError("Full name is required.");
  }

  if (empty($_POST["company_name"])) {
    $validation->addError("Company name is required.");
  }

  if (empty($_POST["mats_required"])) {
    $validation->addError("Amount of mats is required.");
  }

  if (empty($_POST['goal_of_class'])) {
    $validation->addError("Goal is required.");
  } else {
    $classGoal = $_POST['goal_of_class'];
    $valToEnum = GoalOption::tryFrom($classGoal);
    if (empty($valToEnum))
      $validation->addError("$classGoal is not a valid goal.");
  }

  if (empty($_POST["class_duration"])) {
    $validation->addError("Duration of classes is required.");
  }

  return $validation;
}

$validation = validateInput();

echo json_encode($validation->getResult());
?>