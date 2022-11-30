import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Roles } from "src/auth/role.decorator";
import { CurrentUser } from "src/auth/user.decorator";
import { User } from "src/user/entities/user.entity";
import { AddTamTruInput, AddTamTruOutput, xemThongTinTamTruOutput } from "../dto/tamtru.dto";
import { AddTamVangInput } from "../dto/tamvang.dto";
import { TamTru } from "../entity/tamtru.entity";
import { TamVang } from "../entity/tamvang.entity";
import { TamVangService } from "../service/tamvang.service";

@Resolver(() => TamVang)
export class TamTruResolver {
    constructor(private readonly tamVangService: TamVangService) { }

    @Mutation(() => AddTamTruOutput)
    @Roles(['ToTruong', 'ToPho'])
    async addTamTru(@CurrentUser() nguoiPheDuyet: User,
        @Args('input') input: AddTamVangInput,) {
        return this.tamVangService.addTamVang(nguoiPheDuyet, input);
    }
    @Query(() => xemThongTinTamTruOutput)
    @Roles(['Any'])
    xemThongTinTamTru(@CurrentUser() user: User) {
        return this.tamVangService.xemThongTinTamVang(user);
    }
}
