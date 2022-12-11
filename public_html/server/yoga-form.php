<?php
declare(strict_types=1);
include("enums.php");
include("validation.php");

class YogaFormModel extends Model
{
  private string $full_name;
  private string $company_name;
  private int $mats_required;
  private GoalOption $goal_of_class;
  private ClassDurationOption $class_duration;

  public function __construct($data = null)
  {
    if ($data === null)
      return;

    $this->setFullName($data["full_name"]);
    $this->setCompanyName($data["company_name"]);
    $this->setMatsRequired($data["mats_required"]);
    $this->setGoalOfClass($data["goal_of_class"]);
    $this->setClassDuration($data["class_duration"]);
  }

  public function setFullName($name)
  {
    $this->full_name = $this->sanitizeString($name);
  }

  public function setCompanyName($name)
  {
    $this->company_name = $this->sanitizeString($name);
  }

  public function setMatsRequired($mats)
  {
    $this->mats_required = $this->sanitizeInt((int) $mats);
  }

  public function setGoalOfClass($value)
  {
    $sanitized = $this->sanitizeString($value);
    $this->goal_of_class = GoalOption::tryFrom($sanitized);
  }

  public function setClassDuration($value)
  {
    $sanitized = $this->sanitizeString($value);
    $this->class_duration = ClassDurationOption::tryFrom($sanitized);
  }

  public function succeeded()
  {
    $this->validateProperties();
    return parent::succeeded();
  }

  public function getValidationResult()
  {
    $this->validateProperties();
    return parent::getValidationResult();
  }

  public function getErrors()
  {
    $this->validateProperties();
    return parent::getErrors();
  }

  private function validateProperties()
  {
    if (empty($this->full_name)) {
      $this->vr->addError("Full name is required");
    } else {
      $nameLen = strlen($this->full_name);
      if ($this->numberIsWithinRange($nameLen, 1, 30) === false) {
        $this->vr->addError("Full name should be between 1 and 30 characters.");
      }
    }

    if (empty($this->company_name)) {
      $this->vr->addError("Company name is required.");
    } else {
      $nameLen = strlen($this->company_name);
      if ($this->numberIsWithinRange($nameLen, 1, 60) === false) {
        $this->vr->addError("Company name should be between 1 and 60 characters.");
      }
    }

    if (empty($this->mats_required)) {
      $this->vr->addError("Amount of mats is required.");
    } else if ($this->numberIsWithinRange($this->mats_required, 0, 20) === false) {
      $this->vr->addError("Mat amount should be less than 20.");
    }


    if (empty($this->goal_of_class)) {
      $this->vr->addError("Goal is required.");
    }

    if (empty($this->class_duration)) {
      $this->vr->addError("Duration of classes is required.");
    }

  }
}

$yogaRecord = new YogaFormModel($_POST);
echo json_encode($yogaRecord->getValidationResult());
?>