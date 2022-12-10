<?php
declare(strict_types=1);

class ValidationResult
{
  public array $errors;
  public function success(): bool
  {
    return count($this->errors) === 0;
  }
}

?>