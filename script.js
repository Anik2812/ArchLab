const componentTypes = [
    { type: 'cpu', name: 'CPU', description: 'Central Processing Unit: The brain of the computer that performs calculations and executes instructions.' },
    { type: 'memory', name: 'RAM', description: 'Random Access Memory: Temporary storage for data and instructions that the CPU needs to access quickly.' },
    { type: 'gpu', name: 'GPU', description: 'Graphics Processing Unit: Specialized processor for rendering images, video, and 3D graphics.' },
    { type: 'storage', name: 'SSD', description: 'Solid State Drive: Fast, reliable storage for long-term data retention.' },
    { type: 'network', name: 'NIC', description: 'Network Interface Card: Enables communication with other devices on a network.' }
];

const componentShop = document.getElementById('components');
const motherboard = document.getElementById('motherboard');
const processButton = document.getElementById('process-instructions');
const output = document.getElementById('output');
const instructionText = document.getElementById('instruction-text');
const clockSpeed = document.getElementById('clock-speed');
const clockSpeedValue = document.getElementById('clock-speed-value');
const memoryCapacity = document.getElementById('memory-capacity');
const memoryCapacityValue = document.getElementById('memory-capacity-value');

const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const closeModal = document.getElementsByClassName('close')[0];

// Add this to the existing JavaScript

const toggleManualButton = document.getElementById('toggle-manual');
const manualContent = document.getElementById('manual-content');
const loadExampleButton = document.getElementById('load-example');

toggleManualButton.addEventListener('click', () => {
    manualContent.style.display = manualContent.style.display === 'none' ? 'block' : 'none';
});

loadExampleButton.addEventListener('click', loadExampleInstructions);

function loadExampleInstructions() {
    const exampleInstructions = [
        "calculate 2 + 2",
        "read file from storage",
        "write data to memory",
        "render 3D graphics",
        "send data over network"
    ];
    instructionText.value = exampleInstructions.join('\n');
}

// Update the simulateInstruction function to handle more specific instructions
function simulateInstruction(instruction, components) {
    let steps = '';
    steps += `1. CPU fetches instruction from RAM\n`;
    steps += `2. CPU decodes the instruction\n`;
    steps += `3. CPU executes the instruction:\n`;
    
    if (instruction.toLowerCase().includes('calculate')) {
        const calculation = instruction.split('calculate')[1].trim();
        try {
            const result = eval(calculation);
            steps += `   - Performing calculation: ${calculation} = ${result}\n`;
        } catch (error) {
            steps += `   - Error in calculation: ${error.message}\n`;
        }
    } else if (instruction.toLowerCase().includes('read') && instruction.toLowerCase().includes('storage')) {
        steps += `   - Reading file from Storage (SSD)\n`;
        steps += `   - Transferring data to RAM\n`;
    } else if (instruction.toLowerCase().includes('write') && instruction.toLowerCase().includes('memory')) {
        steps += `   - Writing data to RAM\n`;
    } else if (instruction.toLowerCase().includes('render') && instruction.toLowerCase().includes('3d')) {
        if ([...components].some(c => c.dataset.type === 'gpu')) {
            steps += `   - Offloading 3D rendering to GPU\n`;
            steps += `   - GPU processing vertex and fragment shaders\n`;
            steps += `   - GPU rasterizing and applying textures\n`;
        } else {
            steps += `   - Processing 3D graphics on CPU (consider adding a GPU for better performance)\n`;
            steps += `   - CPU performing software rendering (slower)\n`;
        }
    } else if (instruction.toLowerCase().includes('send') && instruction.toLowerCase().includes('network')) {
        if ([...components].some(c => c.dataset.type === 'network')) {
            steps += `   - Preparing data for network transmission\n`;
            steps += `   - NIC encoding data and sending through network protocol\n`;
        } else {
            steps += `   - Network operation requested, but no NIC found\n`;
            steps += `   - Unable to send data over network\n`;
        }
    } else {
        steps += `   - Executing general instruction\n`;
    }
    
    steps += `4. CPU stores the result in RAM or sends to output\n`;
    return steps;
}

// Add this function to check if all necessary components are present
function checkRequiredComponents(components) {
    const requiredComponents = ['cpu', 'memory', 'storage'];
    const missingComponents = requiredComponents.filter(component => 
        ![...components].some(c => c.dataset.type === component)
    );
    return missingComponents;
}

// Update the runSimulation function to use the new checkRequiredComponents function
function runSimulation() {
    const components = motherboard.children;
    const missingComponents = checkRequiredComponents(components);
    
    if (missingComponents.length > 0) {
        output.textContent = `Please add the following components before running the simulation: ${missingComponents.join(', ')}`;
        return;
    }

    const instructions = instructionText.value.split('\n').filter(instruction => instruction.trim() !== '');
    if (instructions.length === 0) {
        output.textContent = "Please enter at least one instruction.";
        return;
    }

    const speed = parseFloat(clockSpeed.value);
    const memory = parseInt(memoryCapacity.value);

    let outputText = `System Configuration:\n`;
    outputText += `Clock Speed: ${speed} GHz\n`;
    outputText += `Memory Capacity: ${memory} GB\n\n`;
    outputText += `Processing ${instructions.length} instruction(s):\n\n`;

    instructions.forEach((instruction, index) => {
        outputText += `Instruction ${index + 1}: ${instruction}\n`;
        outputText += simulateInstruction(instruction, components);
        outputText += `\n`;
    });

    const totalTime = (instructions.length * (1 / speed)).toFixed(2);
    outputText += `Total processing time: ${totalTime} seconds\n`;

    output.textContent = outputText;
    animateOutput();
}

// Populate component shop
componentTypes.forEach(component => {
    const componentElement = createComponent(component);
    componentShop.appendChild(componentElement);
});

function createComponent(component) {
    const element = document.createElement('div');
    element.className = 'component';
    element.textContent = component.name;
    element.dataset.type = component.type;
    element.draggable = true;
    element.addEventListener('dragstart', drag);
    element.addEventListener('click', () => showComponentInfo(component));
    return element;
}

function showComponentInfo(component) {
    modalTitle.textContent = component.name;
    modalDescription.textContent = component.description;
    modal.style.display = 'block';
}

closeModal.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

function drag(ev) {
    ev.dataTransfer.setData('text', ev.target.dataset.type);
}

motherboard.addEventListener('dragover', allowDrop);
motherboard.addEventListener('drop', drop);

function allowDrop(ev) {
    ev.preventDefault();
}

function drop(ev) {
    ev.preventDefault();
    const componentType = ev.dataTransfer.getData('text');
    const component = componentTypes.find(c => c.type === componentType);
    if (component) {
        const newComponent = createComponent(component);
        motherboard.appendChild(newComponent);
        animateComponent(newComponent);
    }
}

function animateComponent(element) {
    anime({
        targets: element,
        scale: [0, 1],
        opacity: [0, 1],
        easing: 'easeOutElastic(1, .8)',
        duration: 800
    });
}

clockSpeed.addEventListener('input', updateClockSpeed);
memoryCapacity.addEventListener('input', updateMemoryCapacity);

function updateClockSpeed() {
    clockSpeedValue.textContent = clockSpeed.value + ' GHz';
}

function updateMemoryCapacity() {
    memoryCapacityValue.textContent = memoryCapacity.value + ' GB';
}

processButton.addEventListener('click', runSimulation);

function runSimulation() {
    const components = motherboard.children;
    if (components.length < 3) {
        output.textContent = "Please add at least CPU, RAM, and Storage components before running the simulation.";
        return;
    }

    const instructions = instructionText.value.split('\n').filter(instruction => instruction.trim() !== '');
    if (instructions.length === 0) {
        output.textContent = "Please enter at least one instruction.";
        return;
    }

    const speed = parseFloat(clockSpeed.value);
    const memory = parseInt(memoryCapacity.value);

    let outputText = `System Configuration:\n`;
    outputText += `Clock Speed: ${speed} GHz\n`;
    outputText += `Memory Capacity: ${memory} GB\n\n`;
    outputText += `Processing ${instructions.length} instruction(s):\n\n`;

    instructions.forEach((instruction, index) => {
        outputText += `Instruction ${index + 1}: ${instruction}\n`;
        outputText += simulateInstruction(instruction, components);
        outputText += `\n`;
    });

    const totalTime = (instructions.length * (1 / speed)).toFixed(2);
    outputText += `Total processing time: ${totalTime} seconds\n`;

    output.textContent = outputText;
    animateOutput();
}

function simulateInstruction(instruction, components) {
    let steps = '';
    steps += `1. CPU fetches instruction from RAM\n`;
    steps += `2. CPU decodes the instruction\n`;
    steps += `3. CPU executes the instruction:\n`;
    
    if (instruction.toLowerCase().includes('calculate') || instruction.toLowerCase().includes('compute')) {
        steps += `   - Performing calculation\n`;
    }
    if (instruction.toLowerCase().includes('read') || instruction.toLowerCase().includes('load')) {
        steps += `   - Reading data from RAM\n`;
    }
    if (instruction.toLowerCase().includes('write') || instruction.toLowerCase().includes('save')) {
        steps += `   - Writing data to Storage (SSD)\n`;
    }
    if (instruction.toLowerCase().includes('display') || instruction.toLowerCase().includes('render')) {
        if ([...components].some(c => c.dataset.type === 'gpu')) {
            steps += `   - Offloading graphics processing to GPU\n`;
        } else {
            steps += `   - Processing graphics on CPU (consider adding a GPU for better performance)\n`;
        }
    }
    if (instruction.toLowerCase().includes('send') || instruction.toLowerCase().includes('receive')) {
        if ([...components].some(c => c.dataset.type === 'network')) {
            steps += `   - Using NIC for network communication\n`;
        } else {
            steps += `   - Network operation requested, but no NIC found\n`;
        }
    }
    
    steps += `4. CPU stores the result in RAM or sends to output\n`;
    return steps;
}

function animateOutput() {
    anime({
        targets: output,
        backgroundColor: ['#1a1a2e', '#2a3a5e', '#1a1a2e'],
        duration: 1000,
        easing: 'easeInOutQuad'
    });
}

// Initial setup
updateClockSpeed();
updateMemoryCapacity();