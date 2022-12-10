<?php
declare(strict_types=1);

class ValidationResult
{
  public array $errors;
  public function success()
  {
    count($this->errors) === 0;
  }
}

?>