<?php
declare(strict_types=1);

class ValidationResult
{
  public array $errors = array();
  public function success()
  {
    return count($this->errors) === 0;
  }
}
?>