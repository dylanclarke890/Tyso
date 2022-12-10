<?php
/**
 * Validation result
 */
class ValidationResult
{
  /**
   * Callback for translating the error message
   * @var callable
   */
  public static $translate;


  /**
   * @var array
   */
  protected $errors = [];


  /**
   * Translate a message
   *
   * @param string $message
   * @return $message
   */
  public function translate($message)
  {
    if (!isset(static::$translate))
      return $message;
    return call_user_func(static::$translate, $message);
  }

  /**
   * Add an error
   * 
   * @param string $message
   * @param mixed  ...$args  Arguments to insert into the message
   */
  public function addError($message, ...$args)
  {
    $message = $this->translate($message);
    if (!empty($args))
      $message = vsprintf($message, $args);

    $this->errors[] = $message;
  }

  /**
   * Add errors from a validation object
   * 
   * @param ValidationResult $validation
   * @param string           $prefix
   */
  public function add(ValidationResult $validation, $prefix = null)
  {
    $prefix = $this->translate($prefix);

    foreach ($validation->getErrors() as $err) {
      $this->errors[] = ($prefix ? trim($prefix) . ' ' : '') . $err;
    }
  }


  /**
   * Check if there are no validation errors
   * 
   * @return boolean
   */
  public function succeeded()
  {
    return empty($this->errors);
  }

  /**
   * Alias of succeeded()
   * 
   * @return boolean
   */
  final public function isSuccess()
  {
    return $this->succeeded();
  }

  /**
   * Check if there are validation errors
   * 
   * @return boolean
   */
  public function failed()
  {
    return !empty($this->errors);
  }


  /**
   * Get the (first) validation error
   * 
   * @return string|null
   */
  public function getError()
  {
    if (count($this->errors) > 1) {
      trigger_error("There are multiple errors, returning only the first", E_USER_NOTICE);
    }

    return reset($this->errors) ?: null;
  }

  /**
   * Get the validation errors
   * 
   * @return array
   */
  public function getErrors(): array
  {
    return $this->errors;
  }

  public function getResult()
  {
    $result = new stdClass;
    $result->success = $this->succeeded();
    $result->errors = $this->getErrors();
    return $result;
  }


  /**
   * Throw a validation exception if there are any errors
   */
  public function mustSucceed()
  {
    if ($this->failed()) {
      throw new ValidationException($this);
    }
  }


  /**
   * Factory method for successful validation
   * 
   * @return static
   */
  public static function success()
  {
    return new static ();
  }

  /**
   * Factory method for failed validation
   * 
   * @param string $message
   * @param mixed  ...$args  Arguments to insert into the message
   * @return static
   */
  public static function error($message, ...$args)
  {
    $validation = new static ();
    $validation->addError($message, ...$args);

    return $validation;
  }
}

/**
 * Validation exception
 */
class ValidationException extends \RuntimeException
{
  /**
   * @var ValidationResult
   */
  protected $validationResult;

  /**
   * ValidationException constructor.
   *
   * @param ValidationResult $validation
   * @throws \UnexpectedValueException
   */
  public function __construct(ValidationResult $validation)
  {
    if (!$validation->failed()) {
      throw new \UnexpectedValueException('Validation didn\'t fail, no exception should be thrown');
    }

    parent::__construct("Validation failed;\n * " . join("\n * ", $validation->getErrors()));

    $this->validationResult = $validation;
  }

  /**
   * Get the validation result with the validation errors.
   *
   * @return ValidationResult
   */
  public function getValidationResult()
  {
    return $this->validationResult;
  }

  /**
   * Get the (first) validation error
   *
   * @return string
   */
  public function getError()
  {
    return $this->validationResult->getError();
  }

  /**
   * Get the validation errors
   *
   * @return array
   */
  public function getErrors()
  {
    return $this->validationResult->getErrors();
  }


  /**
   * Factory method for failed validation
   *
   * @param string $message
   * @param mixed  ...$args  Arguments to insert into the message
   * @return static
   */
  public static function error($message, ...$args)
  {
    $error = ValidationResult::error($message, ...$args);

    return new static ($error);
  }
}