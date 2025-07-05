import { NextResponse } from 'next/server';
import si from 'systeminformation';

export async function GET() {
  const [cpu, temp, mem] = await Promise.all([
    si.currentLoad(),
    si.cpuTemperature(),
    si.mem(),
  ]);

  return NextResponse.json({
    cpu: cpu.currentLoad.toFixed(1),
    cores: cpu.cpus.map((core: any) => core.load.toFixed(1)),
    temp: temp.main ? temp.main.toFixed(1) : null,
    mem: {
      total: (mem.total / 1024 / 1024).toFixed(0), // MB
      used: ((mem.total - mem.available) / 1024 / 1024).toFixed(0), // MB
    },
  });
}
