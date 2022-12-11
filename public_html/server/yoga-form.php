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
  } else {
    $name = $_POST["full_name"];
    $nameLen = strlen($name);
    if ($nameLen <= 1 || $nameLen >= 30) {
      $validation->addError("Full name should be between 1 and 30 characters.");
    }
  }

  if (empty($_POST["company_name"])) {
    $validation->addError("Company name is required.");
  } else {
    $name = $_POST["company_name"];
    $nameLen = strlen($name);
    if ($nameLen <= 1 || $nameLen >= 60) {
      $validation->addError("Company name should be between 1 and 30 characters.");
    }
  }

  if (empty($_POST["mats_required"])) {
    $validation->addError("Amount of mats is required.");
  } else {
    $matsRequired = $_POST["mats_required"];
    if (!is_numeric($matsRequired)) {
      $validation->addError("Mat amount should be a valid number.");
    }
    $matsRequired = (int) $matsRequired;
    if ($matsRequired > 20) {
      $validation->addError("Mat amount should be less than 20.");
    }
  }

  if (empty($_POST['goal_of_class'])) {
    $validation->addError("Goal is required.");
  } else {
    $duration = $_POST['goal_of_class'];
    $valToEnum = GoalOption::tryFrom($duration);
    if (empty($valToEnum))
      $validation->addError("$duration is not a valid goal.");
  }

  if (empty($_POST["class_duration"])) {
    $validation->addError("Duration of classes is required.");
  } else {
    $duration = $_POST['class_duration'];
    $valToEnum = ClassDurationOption::tryFrom($duration);
    if (empty($valToEnum))
      $validation->addError("$duration is not a valid goal.");
  }

  return $validation;
}

$validation = validateInput();

echo json_encode($validation->getResult());
?>