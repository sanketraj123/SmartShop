
const algorithms = {
  bubble: {
    name: "Bubble Sort",
    explanation: "Compare adjacent elements and swap them when the left element is greater.",
    steps: [
      "Start from the first element.",
      "Compare two adjacent elements.",
      "Swap them if the left element is greater.",
      "Repeat until the array is sorted."
    ],
    time: "O(n²)",
    space: "O(1)"
  },

  selection: {
    name: "Selection Sort",
    explanation: "Find the smallest element in the unsorted part and place it at the beginning.",
    steps: [
      "Assume the first unsorted element is minimum.",
      "Compare it with the remaining elements.",
      "Find the smallest element.",
      "Swap it with the first unsorted element."
    ],
    time: "O(n²)",
    space: "O(1)"
  },

  insertion: {
    name: "Insertion Sort",
    explanation: "Take one element at a time and insert it into its correct position in the sorted part.",
    steps: [
      "Treat the first element as sorted.",
      "Take the next element as the key.",
      "Compare the key with elements on its left.",
      "Shift larger elements right.",
      "Insert the key into its correct position."
    ],
    time: "O(n²)",
    space: "O(1)"
  },

  merge: {
    name: "Merge Sort",
    explanation: "Divide the array into smaller parts, sort them, and merge them in order.",
    steps: [
      "Divide the array into two halves.",
      "Keep dividing until each part has one element.",
      "Compare elements from two sorted parts.",
      "Merge them in ascending order."
    ],
    time: "O(n log n)",
    space: "O(n)"
  },

  quick: {
    name: "Quick Sort",
    explanation: "Choose a pivot, put smaller elements on its left and larger elements on its right, then sort both sides.",
    steps: [
      "Choose a pivot element.",
      "Move smaller elements to the left.",
      "Move larger elements to the right.",
      "Repeat for both partitions."
    ],
    time: "O(n log n) average",
    space: "O(log n) average"
  }
};

let currentArray = [89, 12, 34, 55, 60, 36, 52, 41, 78];
let currentAlgorithm = "bubble";
let sortingSteps = [];
let stepIndex = 0;
let comparisons = 0;
let swaps = 0;

/* READ NUMBERS */

function readNumbers() {
  const input = document.getElementById("arrayInput");
  const text = input ? input.value.trim() : "";

  if (!text) {
    alert("Please enter some numbers.");
    return null;
  }

  const values = text.split(/[,\s]+/).map(Number);

  if (values.some(value => !Number.isFinite(value))) {
    alert("Please enter valid numbers separated by commas or spaces.");
    return null;
  }

  if (values.length > 30) {
    alert("Please enter 30 numbers or fewer.");
    return null;
  }

  return values;
}

/* DRAW SORTING BARS */

function renderBars(array, active = [], sorted = []) {
  const container = document.getElementById("sortingBars");
  if (!container) return;

  container.innerHTML = "";

  if (array.length === 0) {
    container.textContent = "No numbers to display.";
    return;
  }

  const max = Math.max(...array.map(value => Math.abs(value)), 1);

  array.forEach((value, index) => {
    const bar = document.createElement("div");
    bar.className = "sort-bar";

    bar.style.height =
      `${Math.max(8, Math.abs(value) / max * 180)}px`;

    if (active.includes(index)) {
      bar.classList.add("active");
    }

    if (sorted.includes(index)) {
      bar.classList.add("sorted");
    }

    const label = document.createElement("span");
    label.textContent = value;

    bar.appendChild(label);
    container.appendChild(bar);
  });
}

/* SAVE EACH STEP */

function addStep(description, array, active = [], sorted = []) {
  sortingSteps.push({
    description,
    array: [...array],
    active: [...active],
    sorted: [...sorted],
    comparisons,
    swaps
  });
}

/* BUBBLE SORT */

function createBubbleSteps(input) {
  const a = [...input];

  addStep("Initial array.", a);

  for (let i = 0; i < a.length - 1; i++) {
    let changed = false;

    for (let j = 0; j < a.length - i - 1; j++) {
      comparisons++;

      addStep(`Compare ${a[j]} and ${a[j + 1]}.`, a, [j, j + 1]);

      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swaps++;
        changed = true;

        addStep(
          `Swap them. The array becomes ${a.join(", ")}.`,
          a,
          [j, j + 1]
        );
      }
    }

    if (!changed) break;
  }

  addStep(
    `Sorting completed! Final array: ${a.join(", ")}.`,
    a,
    [],
    a.map((_, i) => i)
  );
}

/* SELECTION SORT */

function createSelectionSteps(input) {
  const a = [...input];

  addStep("Initial array.", a);

  for (let i = 0; i < a.length - 1; i++) {
    let min = i;

    addStep(`Pass ${i + 1}: Find the smallest element.`, a, [i]);

    for (let j = i + 1; j < a.length; j++) {
      comparisons++;

      addStep(
        `Compare ${a[min]} with ${a[j]}.`,
        a,
        [min, j]
      );

      if (a[j] < a[min]) {
        min = j;
        addStep(`${a[min]} is the new minimum.`, a, [min]);
      }
    }

    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      swaps++;

      addStep(
        `Place ${a[i]} in its correct position.`,
        a,
        [i, min],
        Array.from({ length: i + 1 }, (_, k) => k)
      );
    } else {
      addStep(
        `${a[i]} is already in the correct position.`,
        a,
        [i],
        Array.from({ length: i + 1 }, (_, k) => k)
      );
    }
  }

  addStep(
    `Sorting completed! Final array: ${a.join(", ")}.`,
    a,
    [],
    a.map((_, i) => i)
  );
}

/* INSERTION SORT */

function createInsertionSteps(input) {
  const a = [...input];

  addStep("Initial array.", a);

  for (let i = 1; i < a.length; i++) {
    const key = a[i];
    let j = i - 1;

    addStep(`Take ${key} as the key.`, a, [i]);

    while (j >= 0) {
      comparisons++;

      addStep(
        `Compare ${a[j]} with key ${key}.`,
        a,
        [j, j + 1]
      );

      if (a[j] > key) {
        a[j + 1] = a[j];
        swaps++;

        addStep(
          `Shift ${a[j]} one position to the right.`,
          a,
          [j, j + 1]
        );

        j--;
      } else {
        break;
      }
    }

    a[j + 1] = key;

    addStep(`Insert ${key} at position ${j + 1}.`, a, [j + 1]);
  }

  addStep(
    `Sorting completed! Final array: ${a.join(", ")}.`,
    a,
    [],
    a.map((_, i) => i)
  );
}

/* MERGE SORT */


function createMergeSteps(arr) {
    const steps = [];
    const workingArray = [...arr];

    function addMergeStep(message, values, highlights = []) {
        steps.push({
            array: [...values],
            message: message,
            highlights: [...highlights]
        });
    }

    addMergeStep(
        "Step 1: Start with the original array.",
        workingArray
    );

    function mergeSort(values, startIndex = 0) {
        if (values.length <= 1) {
            addMergeStep(
                `Single-element array [${values.join(", ")}] is already sorted.`,
                workingArray,
                [startIndex]
            );
            return [...values];
        }

        const middle = Math.floor(values.length / 2);

        const left = values.slice(0, middle);
        const right = values.slice(middle);

        addMergeStep(
            `Divide [${values.join(", ")}] into [${left.join(", ")}] and [${right.join(", ")}].`,
            workingArray
        );

        const sortedLeft = mergeSort(left, startIndex);
        const sortedRight = mergeSort(right, startIndex + middle);

        addMergeStep(
            `Merge the sorted parts [${sortedLeft.join(", ")}] and [${sortedRight.join(", ")}].`,
            workingArray
        );

        const merged = [];
        let i = 0;
        let j = 0;

        while (i < sortedLeft.length && j < sortedRight.length) {
            addMergeStep(
                `Compare ${sortedLeft[i]} and ${sortedRight[j]}.`,
                workingArray,
                [startIndex + i, startIndex + middle + j]
            );

            if (sortedLeft[i] <= sortedRight[j]) {
                merged.push(sortedLeft[i]);
                i++;
            } else {
                merged.push(sortedRight[j]);
                j++;
            }

            addMergeStep(
                `Current merged part: [${merged.join(", ")}].`,
                workingArray
            );
        }

        while (i < sortedLeft.length) {
            merged.push(sortedLeft[i]);
            addMergeStep(
                `Add remaining value ${sortedLeft[i]} to the merged part.`,
                workingArray
            );
            i++;
        }

        while (j < sortedRight.length) {
            merged.push(sortedRight[j]);
            addMergeStep(
                `Add remaining value ${sortedRight[j]} to the merged part.`,
                workingArray
            );
            j++;
        }

        // Update this section of the array with the sorted merged values.
        for (let k = 0; k < merged.length; k++) {
            workingArray[startIndex + k] = merged[k];
        }

        addMergeStep(
            `Merged result: [${merged.join(", ")}].`,
            workingArray
        );

        return merged;
    }

    const sortedArray = mergeSort([...arr]);

    addMergeStep(
        `Step complete! Final sorted array: [${sortedArray.join(", ")}].`,
        sortedArray
    );

    return steps;
}

/* QUICK SORT */

function createQuickSteps(input) {
  const a = [...input];

  addStep("Initial array.", a);

  function quickSort(low, high) {
    if (low >= high) return;

    const pivot = a[high];
    let i = low - 1;

    addStep(`Choose ${pivot} as the pivot.`, a, [high]);

    for (let j = low; j < high; j++) {
      comparisons++;

      addStep(`Compare ${a[j]} with pivot ${pivot}.`, a, [j, high]);

      if (a[j] <= pivot) {
        i++;

        if (i !== j) {
          [a[i], a[j]] = [a[j], a[i]];
          swaps++;

          addStep(
            "Move the smaller element into the left partition.",
            a,
            [i, j]
          );
        }
      }
    }

    const pivotIndex = i + 1;

    if (pivotIndex !== high) {
      [a[pivotIndex], a[high]] = [a[high], a[pivotIndex]];
      swaps++;
    }

    addStep(
      `Place pivot ${pivot} in its correct position.`,
      a,
      [pivotIndex],
      [pivotIndex]
    );

    quickSort(low, pivotIndex - 1);
    quickSort(pivotIndex + 1, high);
  }

  quickSort(0, a.length - 1);

  addStep(
    `Sorting completed! Final array: ${a.join(", ")}.`,
    a,
    [],
    a.map((_, i) => i)
  );
}

/* UPDATE ALGORITHM INFORMATION */

function updateLab() {
  const algorithm = algorithms[currentAlgorithm];

  document.querySelectorAll("[data-algorithm]").forEach(button => {
    const selected = button.dataset.algorithm === currentAlgorithm;

    button.classList.toggle("selected", selected);
    button.setAttribute("aria-pressed", String(selected));
  });

  const title = document.getElementById("selectedAlgorithmName");
  if (title) title.textContent = algorithm.name;

  const explanation = document.getElementById("algorithmExplanation");
  if (explanation) explanation.textContent = algorithm.explanation;

  const time = document.getElementById("algorithmTime");
  if (time) time.textContent = algorithm.time;

  const space = document.getElementById("algorithmSpace");
  if (space) space.textContent = algorithm.space;

  const list = document.getElementById("algorithmSteps");

  if (list) {
    list.innerHTML = "";

    algorithm.steps.forEach(step => {
      const item = document.createElement("li");
      item.textContent = step;
      list.appendChild(item);
    });
  }
}

/* START SORTING */

function startSorting() {
  const input = readNumbers();

  if (input === null) return;

  currentArray = [...input];
  sortingSteps = [];
  stepIndex = 0;
  comparisons = 0;
  swaps = 0;

  if (currentAlgorithm === "bubble") createBubbleSteps(input);
  else if (currentAlgorithm === "selection") createSelectionSteps(input);
  else if (currentAlgorithm === "insertion") createInsertionSteps(input);
  else if (currentAlgorithm === "merge") createMergeSteps(input);
  else if (currentAlgorithm === "quick") createQuickSteps(input);

  showStep(0);
}

/* DISPLAY A STEP */

function showStep(index) {
  if (sortingSteps.length === 0) return;

  stepIndex = Math.max(0, Math.min(index, sortingSteps.length - 1));

  const step = sortingSteps[stepIndex];

  renderBars(step.array, step.active, step.sorted);

  const description = document.getElementById("stepDescription");
  if (description) description.textContent = step.description;

  const counter = document.getElementById("stepCounter");
  if (counter) {
    counter.textContent = `Step ${stepIndex + 1} of ${sortingSteps.length}`;
  }

  const output = document.getElementById("arrayOutput");
  if (output) output.textContent = step.array.join(", ");

  const comparisonOutput = document.getElementById("comparisonCount");
  if (comparisonOutput) comparisonOutput.textContent = step.comparisons;

  const swapOutput = document.getElementById("swapCount");
  if (swapOutput) swapOutput.textContent = step.swaps;

  const previousButton = document.getElementById("previousStep");
  const nextButton = document.getElementById("nextStep");

  if (previousButton) previousButton.disabled = stepIndex === 0;

  if (nextButton) {
    nextButton.disabled = stepIndex === sortingSteps.length - 1;
  }
}

function nextStep() {
  if (sortingSteps.length === 0) {
    startSorting();
    return;
  }

  showStep(stepIndex + 1);
}

function previousStep() {
  showStep(stepIndex - 1);
}

/* RESET */

function resetSorting() {
  sortingSteps = [];
  stepIndex = 0;
  comparisons = 0;
  swaps = 0;

  renderBars(currentArray);

  const description = document.getElementById("stepDescription");
  if (description) {
    description.textContent =
      `${algorithms[currentAlgorithm].name} selected. Click Start Sorting to begin.`;
  }

  const counter = document.getElementById("stepCounter");
  if (counter) counter.textContent = "Step 0 of 0";

  const output = document.getElementById("arrayOutput");
  if (output) output.textContent = currentArray.join(", ");

  const comparisonOutput = document.getElementById("comparisonCount");
  if (comparisonOutput) comparisonOutput.textContent = "0";

  const swapOutput = document.getElementById("swapCount");
  if (swapOutput) swapOutput.textContent = "0";

  const previousButton = document.getElementById("previousStep");
  const nextButton = document.getElementById("nextStep");

  if (previousButton) previousButton.disabled = true;
  if (nextButton) nextButton.disabled = true;
}

/* SELECT ALGORITHM */

function selectAlgorithm(name) {
  if (!algorithms[name]) return;

  currentAlgorithm = name;
  updateLab();
  resetSorting();
}

/* LOAD EXAMPLE */

function useExample(values) {
  currentArray = [...values];

  const input = document.getElementById("arrayInput");
  if (input) input.value = values.join(", ");

  resetSorting();
}

/* CONNECT WORKED EXAMPLES TO THE LAB */

function openWorkedExample(algorithm, values) {
  selectAlgorithm(algorithm);
  useExample(values);

  const lab = document.getElementById("sorting-lab");

  if (lab) {
    lab.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

/* INITIALIZE AND CONNECT BUTTONS */

document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("arrayInput");

  if (input) input.value = currentArray.join(", ");

  updateLab();
  renderBars(currentArray);
  resetSorting();

  document.querySelectorAll("[data-algorithm]").forEach(button => {
    button.addEventListener("click", () => {
      selectAlgorithm(button.dataset.algorithm);
    });
  });

  const startButton = document.getElementById("startSorting");
  if (startButton) {
    startButton.addEventListener("click", startSorting);
  }

  const nextButton = document.getElementById("nextStep");
  if (nextButton) {
    nextButton.addEventListener("click", nextStep);
  }

  const previousButton = document.getElementById("previousStep");
  if (previousButton) {
    previousButton.addEventListener("click", previousStep);
  }

  const resetButton = document.getElementById("resetSorting");
  if (resetButton) {
    resetButton.addEventListener("click", resetSorting);
  }

  document.querySelectorAll("[data-example]").forEach(button => {
    button.addEventListener("click", () => {
      const values = button.dataset.example
        .split(/[,\s]+/)
        .map(Number);

      useExample(values);
    });
  });
});