import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InvoicesService } from '@invoice2-team/invoices';
import { UsersService } from '@invoice2-team/users';
import { LegendPosition, ColorHelper } from '@swimlane/ngx-charts';

@Component({
    selector: 'app-widget-summary-of-sales-circle',
    templateUrl: './widget-summary-of-sales-circle.component.html',
    styles: ``
})
export class WidgetSummaryOfSalesCircleComponent implements OnInit {
    public single: any[] = [];
    public colorScheme: any;
    public below = LegendPosition.Below;
    public yScaleMin: number = 0;
    public monthLabels: string[] = [];
    public yScaleConfig: { min: number } = { min: 2000 };

    @ViewChild('gridLeftColumn', { static: true })
    public ContainerRef!: ElementRef;

    columnWidth: number = 0;

    constructor(
        private invoicesService: InvoicesService,
        private usersService: UsersService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this._initChartData();
    }

    ngAfterViewInit() {
        //Adjust chart width to parent width
        if (this.ContainerRef && this.ContainerRef.nativeElement) {
            this.columnWidth = (this.ContainerRef.nativeElement as HTMLElement).clientWidth * 0.2;
            this.cdr.detectChanges();
        }
    }
    onGridLeftColumnLoad() {}

    private _initChartData() {
        this.usersService.observeCurrentUser().subscribe((user) => {
            if (user && user.id) {
                const currentUserId = user.id;
                this.invoicesService.getYearlyGrossSums(currentUserId).subscribe((data) => {
                    this.single = this.transformData(data);
                    this.calculateAndSetYScaleMin(data);
                });
            }
        });

        // Pastel Palette use
        const pastelPalette = [
            '#A2E6FD',
            '#FFDDC1',
            '#FFB48F',
            '#FF9F80',
            '#FFA08E',
            '#FFB8C6',
            '#D5B8FF',
            '#B0E0FF',
            '#9FFFD2',
            '#A5FFD6',
            '#A2E6FD',
            '#FFEB3B',
            '#FFC107',
            '#FF9800',
            '#FF5722',
            '#FF5722',
            '#FF5722',
            '#FF5722',
            '#FF5722',
            '#FF5722',
            '#FF5722'
        ];
        this.colorScheme = {
            domain: pastelPalette
        };
    }

    private transformData(data: any): any[] {
        return Object.keys(data).map((key) => {
            const monthIndex = parseInt(key.split('-')[1], 10);
            const monthName = this.getMonthName(monthIndex);

            return {
                name: `${key.split('-')[0]} ${monthName}`,
                value: data[key]
            };
        });
    }

    private calculateAndSetYScaleMin(data: any): void {
        const values = Object.values(data) as number[];
        if (values.length > 0) {
            const minValue = Math.min(...values);
            this.yScaleConfig.min = minValue * 0.9; // Display factor Y
        } else {
            this.yScaleConfig.min = 0;
        }
    }

    private getMonthName(monthNumber: number): string {
        const months = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'];
        return months[monthNumber] || '';
    }
}
