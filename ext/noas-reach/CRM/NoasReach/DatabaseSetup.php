<?php

declare(strict_types=1);

const TAG = "NoasReach/DatabaseSetup";

use CRM_NoasReach_ExtensionUtil as E;

class CRM_NoasReach_DatabaseSetup
{
    public static function install()
    {
        $sqlScriptPath = E::path(
            "sql" . DIRECTORY_SEPARATOR . "auto-install.sql"
        );
        $tag = TAG;
        Civi::log()->info(
            "[$tag] Executing installation script: $sqlScriptPath"
        );
        CRM_Utils_File::sourceSQLFile(CIVICRM_DSN, $sqlScriptPath);
    }

    public static function uninstall()
    {
        Civi::log()
            ->info("[" . TAG . "] Executing uninstallation script");
    }
}
