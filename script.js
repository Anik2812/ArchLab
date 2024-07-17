const componentList = document.getElementById('component-list');
const systemBoard = document.getElementById('system-board');
const cpuStatus = document.getElementById('cpu-status');
const ramStatus = document.getElementById('ram-status');
const storageStatus = document.getElementById('storage-status');
const gpuStatus = document.getElementById('gpu-status');
const clockSpeed = document.getElementById('clock-speed');
const clockSpeedValue = document.getElementById('clock-speed-value');
const instructionSet = document.getElementById('instruction-set');
const runSimulation = document.getElementById('run-simulation');
const outputLog = document.getElementById('output-log');

const components = [
    { type: 'cpu', name: 'CPU (3.5 GHz, 8 cores)' },
    { type: 'ram', name: 'RAM (16 GB DDR4)' },
    { type: 'storage', name: 'SSD (500 GB)' },
    { type: 'gpu', name: 'GPU (8 GB VRAM)' }
];

let installedComponents = {
    cpu: null,
    ram: 0,
    storage: 0,
    gpu: null
};

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

function drop(ev) {
    ev.preventDefault();
    const data = ev.dataTransfer.getData("text");
    installComponent(data);
}

function installComponent(componentName) {
    const component = components.find(c => c.name === componentName);
    if (component) {
        switch (component.type) {
            case 'cpu':
                installedComponents.cpu = component;
                cpuStatus.textContent = `CPU: ${component.name} installed`;
                break;
            case 'ram':
                installedComponents.ram += 16;
                ramStatus.textContent = `RAM: ${installedComponents.ram} GB installed`;
                break;
            case 'storage':
                installedComponents.storage += 500;
                storageStatus.textContent = `Storage: ${installedComponents.storage} GB installed`;
                break;
            case 'gpu':
                installedComponents.gpu = component;
                gpuStatus.textContent = `GPU: ${component.name} installed`;
                break;
        }
        logOutput(`Installed ${component.name}`);
    }
}

// Clock speed control
clockSpeed.addEventListener('input', updateClockSpeed);

function updateClockSpeed() {
    clockSpeedValue.textContent = clockSpeed.value + ' GHz';
    if (installedComponents.cpu) {
        logOutput(`CPU clock speed adjusted to ${clockSpeed.value} GHz`);
    }
}

// Run simulation
runSimulation.addEventListener('click', startSimulation);

function startSimulation() {
    if (!installedComponents.cpu || installedComponents.ram === 0 || installedComponents.storage === 0) {
        logOutput("Error: Please install CPU, RAM, and Storage before running the simulation.");
        return;
    }

    const instructions = instructionSet.value.split('\n').filter(i => i.trim() !== '');
    if (instructions.length === 0) {
        logOutput("Error: No instructions provided. Please enter assembly instructions.");
        return;
    }

    logOutput("Starting simulation...");
    instructions.forEach((instruction, index) => {
        simulateInstruction(instruction, index + 1);
    });
    logOutput("Simulation completed.");
}

function simulateInstruction(instruction, index) {
    logOutput(`Executing instruction ${index}: ${instruction}`);
    // Add more detailed simulation logic here based on the instruction
    // This is a simplified example
    if (instruction.includes('MOV')) {
        logOutput("  Moving data between registers or memory");
    } else if (instruction.includes('ADD')) {
        logOutput("  Performing addition operation");
    } else if (instruction.includes('MUL')) {
        logOutput("  Performing multiplication operation");
    } else if (instruction.includes('JMP')) {
        logOutput("  Jumping to a different instruction");
    } else {
        logOutput("  Executing general instruction");
    }
}

function logOutput(message) {
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    outputLog.appendChild(logEntry);
    outputLog.scrollTop = outputLog.scrollHeight;
}