import { Math, BlockMath } from "../../components/math/Math";
import { Callout } from "../../components/book/Callout";
import { VideoDemo } from "../../components/video/VideoDemo";
import { SystolicArraySim } from "../../simulations/SystolicArraySim";

export function Chapter03() {
  return (
    <>
      <p>
        We have a multiply-accumulate, and we know we need millions of them running at once. The
        naïve plan — a big pile of MACs all reaching into memory for their operands — fails
        immediately, and understanding <em>why</em> it fails is the key that unlocks the shape of
        every AI chip ever built.
      </p>

      <h2 id="problem">The data-movement wall</h2>
      <p>
        Here is the uncomfortable truth of modern hardware: <strong>arithmetic is cheap, and moving
        the operands to the arithmetic is expensive</strong> — in time, in energy, and in chip area.
        Fetching a number from main memory can cost a hundred times the energy of the multiply you
        wanted to do with it. A thousand MACs each independently fetching from memory would spend
        almost all of their time, power, and wiring waiting for data, not computing.
      </p>
      <Callout label="The constraint">
        <p>
          Every interesting decision in chip architecture is an answer to one question: how do I do
          the most arithmetic per byte moved? Keep this in mind and the &ldquo;zoo&rdquo; of
          CPUs, GPUs, TPUs and FPGAs turns into a single family of answers.
        </p>
      </Callout>

      <h2 id="idea">The systolic idea</h2>
      <p>
        So change the plan. Instead of each MAC fetching its own operands, lay the MACs out in a grid
        and let them <em>pass operands to their neighbours</em>. A number read once from the edge of
        the array flows across an entire row or column, getting multiplied at every cell it passes.
        Data pumps through the grid in lockstep with the clock, like blood through tissue — which is
        why H.&nbsp;T.&nbsp;Kung named it a <strong>systolic array</strong> in 1978.
      </p>
      <p>
        One memory read now feeds a whole line of multipliers instead of one. The expensive thing —
        movement — is amortised across the cheap thing — arithmetic. That is the entire trick, and it
        is the beating heart of a TPU.
      </p>

      <h2 id="matmul">Mapping matrix multiply onto the grid</h2>
      <p>
        Matrix multiplication is a perfect fit. To compute <Math>{String.raw`C = AB`}</Math>, each
        output element is a dot product
      </p>
      <BlockMath>{String.raw`C_{ij} = \sum_{k=0}^{n-1} A_{ik}\, B_{kj}`}</BlockMath>
      <p>
        Assign cell <Math>(i,j)</Math> of the array to output <Math>{String.raw`C_{ij}`}</Math>. Stream
        the rows of <Math>A</Math> in from the left and the columns of <Math>B</Math> in from the top,
        each skewed by one cycle so that the right operands meet inside the right cell at the right
        moment. Every cell runs the same <Math>{String.raw`\text{acc} \leftarrow \text{acc} + A_{ik}B_{kj}`}</Math>{" "}
        from the last chapter; when the data finishes flowing, every cell holds its dot product.
      </p>

      <h2 id="array">Array simulator</h2>
      <p>
        Press <strong>Run</strong> and watch operands skew diagonally through the grid. Teal numbers
        are values of <Math>A</Math> entering from the left; the others are values of <Math>B</Math>{" "}
        entering from the top. A cell glows while it is actively multiplying. Increase{" "}
        <Math>N</Math> to see how a bigger array does more work per memory read.
      </p>

      <SystolicArraySim />

      <VideoDemo
        id="systolic-pump"
        n="3.1"
        caption={
          <>
            The systolic &ldquo;heartbeat&rdquo;: operands wavefront diagonally across the array, each
            cell accumulating as the data passes through. No cell ever talks to main memory.
          </>
        }
      />

      <h2 id="takeaway">Why chips look the way they do</h2>
      <p>
        Step back and the whole arc connects. A gate is a switch (Ch.&nbsp;1). A MAC is a pile of
        gates (Ch.&nbsp;2). A systolic array is a grid of MACs that beats the data-movement wall by
        sharing operands. That last constraint — compute is cheap, movement is dear — is what forces
        the design: it is why a TPU is mostly one giant systolic array, why GPUs are bunches of
        smaller matrix engines, why on-chip memory is laid out the way it is, and why the brain,
        which co-locates memory and compute, is so astonishingly efficient.
      </p>
      <p>
        From a single transistor we have arrived at the engine inside every AI accelerator on Earth.
        Everything beyond here — pipelining, caches versus scratchpads, FPGAs versus ASICs, CPU
        cores versus GPU cores — is a refinement of the same question. Those are the chapters still
        to come.
      </p>
    </>
  );
}
