<?php
declare(strict_types = 1);

// phpcs:disable PSR1.Files.SideEffects
require_once 'noas_reach.civix.php';
// phpcs:enable

use CRM_NoasReach_ExtensionUtil as E;

/**
 * Implements hook_civicrm_config().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_config/
 */
function noas_reach_civicrm_config(\CRM_Core_Config $config): void {
  _noas_reach_civix_civicrm_config($config);
}

/**
 * Implements hook_civicrm_install().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_install
 */
function noas_reach_civicrm_install(): void {
  _noas_reach_civix_civicrm_install();
}

/**
 * Implements hook_civicrm_enable().
 *
 * @link https://docs.civicrm.org/dev/en/latest/hooks/hook_civicrm_enable
 */
function noas_reach_civicrm_enable(): void {
  _noas_reach_civix_civicrm_enable();
}
