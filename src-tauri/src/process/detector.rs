use sysinfo::System;

const VALORANT_PROCESS: &str = "VALORANT-Win64-Shipping.exe";
const RIOT_CLIENT_PROCESS: &str = "RiotClientServices.exe";

pub struct ProcessDetector {
    system: System,
}

impl ProcessDetector {
    pub fn new() -> Self {
        Self {
            system: System::new_all(),
        }
    }

    pub fn refresh(&mut self) {
        self.system
            .refresh_processes(sysinfo::ProcessesToUpdate::All, true);
    }

    fn is_process_running(&self, name: &str) -> bool {
        self.system
            .processes()
            .values()
            .any(|process| process.name().to_string_lossy().eq_ignore_ascii_case(name))
    }

    pub fn is_valorant_running(&self) -> bool {
        self.is_process_running(VALORANT_PROCESS)
    }

    pub fn is_riot_client_running(&self) -> bool {
        self.is_process_running(RIOT_CLIENT_PROCESS)
    }

    pub fn are_both_running(&self) -> bool {
        self.is_valorant_running() && self.is_riot_client_running()
    }

    pub fn refreshed(mut self) -> Self {
        self.refresh();
        self
    }
}

impl Default for ProcessDetector {
    fn default() -> Self {
        Self::new()
    }
}
