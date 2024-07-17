// Run simulation
runSimulation.addEventListener('click', startSimulation);

function startSimulation() {
    if (!installedComponents.cpu || installedComponents.ram.length === 0 || installedComponents.storage.length === 0) {
        logOutput("Error: Please install CPU, RAM, and Storage before running the simulation.");
        return;
    }

    const instructions = instructionSet.value.split('\n').filter(i => i.trim() !== '');
    if (instructions.length === 0) {
        logOutput("Error: No instructions provided. Please enter assembly instructions.");
        return;
    }

    logOutput("Starting simulation...");
    let cycleCount = 0;
    instructions.forEach((instruction, index) => {
        cycleCount += simulateInstruction(instruction, index + 1);
    });
    
    const executionTime = (cycleCount / (parseFloat(clockSpeed.value) * 1e9)).toFixed(6);
    logOutput(`Simulation completed. Total cycles: ${cycleCount}. Execution time: ${executionTime} seconds.`);
    updateMemoryUsage();
    updatePowerAndTemp(cycleCount / 1e6); // Assuming 1 watt per million cycles
}

function simulateInstruction(instruction, index) {
    logOutput(`Executing instruction ${index}: ${instruction}`);
    let cycles = 1; // Base cycle count

    const parts = instruction.toUpperCase().split(' ');
    const opcode = parts[0];

    switch (opcode) {
        case 'MOV':
            logOutput("  Moving data between registers or memory");
            cycles += simulateMemoryAccess();
            break;
        case 'ADD':
        case 'SUB':
        case 'MUL':
        case 'DIV':
            logOutput(`  Performing ${opcode.toLowerCase()} operation`);
            cycles += 1;
            break;
        case 'JMP':
        case 'JE':
        case 'JNE':
            logOutput("  Performing conditional jump");
            cycles += 3;
            break;
        case 'PUSH':
        case 'POP':
            logOutput(`  ${opcode === 'PUSH' ? 'Pushing to' : 'Popping from'} stack`);
            cycles += simulateMemoryAccess();
            break;
        case 'CALL':
            logOutput("  Calling subroutine");
            cycles += 4;
            break;
        case 'RET':
            logOutput("  Returning from subroutine");
            cycles += 3;
            break;
        case 'AND':
        case 'OR':
        case 'XOR':
            logOutput(`  Performing ${opcode.toLowerCase()} operation`);
            cycles += 1;
            break;
        default:
            logOutput("  Executing unknown instruction");
            cycles += 2;
    }

    return cycles;
}

function simulateMemoryAccess() {
    const rand = Math.random();
    if (rand < 0.8) {
        logOutput("    Cache hit (L1)");
        return 1;
    } else if (rand < 0.95) {
        logOutput("    Cache hit (L2)");
        return 5;
    } else if (rand < 0.99) {
        logOutput("    Cache hit (L3)");
        return 20;
    } else {
        logOutput("    Cache miss (accessing main memory)");
        return 100;
    }
}

// Dark mode toggle
toggleTheme.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    logOutput("Theme toggled");
});

// Helper function to log output
function logOutput(message) {
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    outputLog.appendChild(logEntry);
    outputLog.scrollTop = outputLog.scrollHeight;
}

// Initial setup
updateMemoryUsage();