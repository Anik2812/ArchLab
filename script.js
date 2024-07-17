const componentList = document.getElementById('component-list');
const systemBoard = document.getElementById('system-board');
const cpuStatus = document.getElementById('cpu-status');
const ramStatus = document.getElementById('ram-status');
const storageStatus = document.getElementById('storage-status');
const gpuStatus = document.getElementById('gpu-status');
const clockSpeed = document.getElementById('clock-speed');
const clockSpeedValue = document.getElementById('clock-speed-value');
const powerConsumption = document.getElementById('power-consumption');
const temperature = document.getElementById('temperature');
const l1Cache = document.getElementById('l1-cache');
const l2Cache = document.getElementById('l2-cache');
const l3Cache = document.getElementById('l3-cache');
const memoryUsage = document.getElementById('memory-usage');
const instructionSet = document.getElementById('instruction-set');
const runSimulation = document.getElementById('run-simulation');
const outputLog = document.getElementById('output-log');
const toggleTheme = document.getElementById('toggle-theme');

const components = [
    { type: 'cpu', name: 'CPU (3.5 GHz, 8 cores)', power: 65, l1: 64, l2: 512, l3: 16384 },
    { type: 'cpu', name: 'CPU (4.0 GHz, 12 cores)', power: 95, l1: 64, l2: 512, l3: 32768 },
    { type: 'ram', name: 'RAM (16 GB DDR4-3200)', power: 10 },
    { type: 'ram', name: 'RAM (32 GB DDR4-3600)', power: 15 },
    { type: 'storage', name: 'SSD (500 GB)', power: 5 },
    { type: 'storage', name: 'HDD (2 TB)', power: 10 },
    { type: 'gpu', name: 'GPU (8 GB VRAM)', power: 200 },
    { type: 'gpu', name: 'GPU (16 GB VRAM)', power: 300 }
];

let installedComponents = {
    cpu: null,
    ram: [],
    storage: [],
    gpu: null
};

let totalPower = 0;
let currentTemperature = 25;

// Populate component list
components.forEach(component => {
    const elem = document.createElement('div');
    elem.textContent = component.name;
    elem.className = 'component';
    elem.draggable = true;
    elem.addEventListener('dragstart', drag);
    componentList.appendChild(elem);
});

// Drag and drop functionality
function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.textContent);
}

systemBoard.addEventListener('dragover', allowDrop);
systemBoard.addEventListener('drop', drop);

function allowDrop(ev) {
    ev.preventDefault();
}

// Update the drop function
function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    const target = ev.target;
    
    if (target.classList.contains('socket') || target.classList.contains('ram-slot') || 
        target.classList.contains('pcie-slot') || target.classList.contains('sata-port')) {
        installComponent(data, target);
    }
}

// Update the installComponent function
function installComponent(componentName, target) {
    const component = components.find(c => c.name === componentName);
    if (component) {
        switch (component.type) {
            case 'cpu':
                if (target.id === 'cpu-socket' && !installedComponents.cpu) {
                    installedComponents.cpu = component;
                    cpuStatus.textContent = `CPU: ${component.name} installed`;
                    updateCacheInfo(component);
                    target.classList.add('installed');
                    updatePowerAndTemp(component.power);
                }
                break;
            case 'ram':
                if (target.classList.contains('ram-slot') && !target.classList.contains('installed')) {
                    installedComponents.ram.push(component);
                    ramStatus.textContent = `RAM: ${getTotalRam()} GB installed`;
                    target.classList.add('installed');
                    updatePowerAndTemp(component.power);
                }
                break;
            case 'storage':
                if (target.classList.contains('sata-port') && !target.classList.contains('installed')) {
                    installedComponents.storage.push(component);
                    storageStatus.textContent = `Storage: ${getTotalStorage()} GB installed`;
                    target.classList.add('installed');
                    updatePowerAndTemp(component.power);
                }
                break;
            case 'gpu':
                if (target.classList.contains('pcie-slot') && !installedComponents.gpu) {
                    installedComponents.gpu = component;
                    gpuStatus.textContent = `GPU: ${component.name} installed`;
                    target.classList.add('installed');
                    updatePowerAndTemp(component.power);
                }
                break;
        }
        updateMemoryUsage();
        logOutput(`Installed ${component.name}`);
    }
}
function getTotalRam() {
    return installedComponents.ram.reduce((total, ram) => total + parseInt(ram.name.match(/\d+/)[0]), 0);
}

// Update getTotalStorage function to handle both GB and TB
function getTotalStorage() {
    return installedComponents.storage.reduce((total, storage) => {
        const match = storage.name.match(/(\d+)\s*(GB|TB)/);
        let capacity = parseInt(match[1]);
        if (match[2] === 'TB') capacity *= 1000;
        return total + capacity;
    }, 0);
}

function updateCacheInfo(cpu) {
    l1Cache.textContent = `L1 Cache: ${cpu.l1} KB`;
    l2Cache.textContent = `L2 Cache: ${cpu.l2} KB`;
    l3Cache.textContent = `L3 Cache: ${cpu.l3} KB`;
}

function updatePowerAndTemp(power) {
    totalPower += power;
    powerConsumption.textContent = `Power Consumption: ${totalPower} W`;
    currentTemperature = Math.min(90, 25 + totalPower / 10);
    temperature.textContent = `Temperature: ${currentTemperature.toFixed(1)}°C`;
}

function updateMemoryUsage() {
    const totalRam = getTotalRam();
    const usedRam = Math.floor(Math.random() * totalRam);
    memoryUsage.textContent = `Memory Usage: ${usedRam} GB / ${totalRam} GB`;
}

// Clock speed control
clockSpeed.addEventListener('input', updateClockSpeed);

function updateClockSpeed() {
    clockSpeedValue.textContent = clockSpeed.value + ' GHz';
    if (installedComponents.cpu) {
        logOutput(`CPU clock speed adjusted to ${clockSpeed.value} GHz`);
        updatePowerAndTemp(Math.pow(clockSpeed.value, 2));
    }
}


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